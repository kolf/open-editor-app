import React, { ReactElement, useState, useCallback, useRef, useEffect, MouseEventHandler } from 'react';
import { message, Tag } from 'antd';
import Loading from 'src/components/common/LoadingBlock';
import KeywordDetails from 'src/components/modals/KeywordDetails';
import KeywordSelectTable from 'src/components/modals/KeywordSelectTable';
import modal from 'src/utils/modal';
import * as tools from 'src/utils/tools';
import { useDoubleClick } from 'src/hooks/useDoubleClick';
import keywordService from 'src/services/keywordService';
import 'src/styles/KeywordTextArea.less';

type valueType = 0 | 1 | 2;

type Props<T> = {
  title: string;
  placeholder?: string;
  height?: number;
  value: T[];
  added?: boolean;
  onChange?: (value: T[], addedValue: T[], removedValue: T[]) => void;
};

function loop(e) {
  e.stopPropagation();
}

export function uniq<T extends IKeywordsTag>(value: T[]): T[] {
  return value.reduce((result, item) => {
    if (!result.find(r => r.value === item.value)) {
      result.push(item);
    }
    return result;
  }, []);
}

export function getValueType(valueItem: IKeywordsTag): valueType {
  if (valueItem.value === valueItem.label) {
    return 0;
  }
  if (/^\d+$/g.test(valueItem.value)) {
    return 1;
  }
  if (/,/g.test(valueItem.value)) {
    return 2;
  }
}

export default React.memo(function KeywordTextArea({
  value,
  added,
  title,
  placeholder = '请输入关键词',
  height = 100,
  onChange
}: Props<IKeywordsTag>): ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputMirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [contenteditable, setContenteditable] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const hybridClick = useDoubleClick(showDetails, deleteValue);

  useEffect(() => {
    if (inputRef.current) {
      const width = value.length === 0 && !inputValue ? 148 : inputMirrorRef.current.clientWidth;
      inputRef.current.style.width = Math.min(wrapRef.current.clientWidth - 4, width) + 'px';
    }
  }, [inputValue, inputRef]);

  async function handleWrapDbClick() {
    if (!added) {
      return;
    }
    if (!contenteditable) {
      //编辑模式
      const nextTextAreaValue = value.map(valueItem => valueItem.label).join('，');
      setInputValue('');
      setTextAreaValue(nextTextAreaValue);
    } else {
      matchTextAreaValue();
    }
    setContenteditable(!contenteditable);
  }

  function handleWrapClick() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  async function showDetails(e) {
    const index: number = e.target.dataset.index * 1;
    const valueItem = value[index];
    const valueType = getValueType(valueItem);

    if (valueType === 0) {
      message.info(`关键词不存在！`);
      return;
    }

    if (valueType === 2) {
      selectValue(index);
      return;
    }

    const mod = modal({
      width: 600,
      title: '关键词详情',
      content: <Loading />,
      footer: null
    });

    try {
      const res = await keywordService.getList(valueItem.value);
      mod.update({
        content: <KeywordDetails dataSource={res[0]} />
      });
    } catch (error) {
      mod.close();
    }
  }

  async function selectValue(index: number) {
    const valueItem = value[index];

    const mod = modal({
      width: 800,
      title: '选择关键词',
      content: <Loading />
    });

    try {
      const res = await keywordService.getList(valueItem.value);
      let contentValue: IdList = [];

      mod.update({
        content: <KeywordSelectTable dataSource={res} onChange={value => (contentValue = value)} />,
        onOk
      });

      function onOk() {
        const addedValue = res
          .filter(r => contentValue.includes(r.id))
          .map(item => ({ value: item.id + '', label: item.cnname, kind: item.kind }));
        const nextValue = value.reduce((result, item, i) => {
          if (index === i) {
            result.push(...addedValue);
          } else {
            result.push(item);
          }
          return result;
        }, []);

        onChange(nextValue, addedValue, [valueItem]);
        mod.close();
      }
    } catch (error) {
      mod.close();
    }
  }

  function deleteValue(e) {
    const index: number = e.target.dataset.index * 1;
    const nextValue = value.filter((item, i) => i !== index);
    onChange(nextValue, [], [value[index]]);
  }

  async function handleInputKeydown(e) {
    const { keyCode } = e;
    if (keyCode === 13 || keyCode === 188) {
      matchInputValue();
    }
  }

  async function handleTextAreaBlur() {
    await matchTextAreaValue();
    setContenteditable(false);
  }

  async function matchInputValue() {
    const text = tools.trim(inputValue);
    if (text) {
      const addedValue = await keywordService.findList(text);
      const nextValue = uniq([...value, ...addedValue]);
      setInputValue('');
      onChange(nextValue, addedValue, []);
    }
  }

  async function matchTextAreaValue() {
    const text = tools.trim(textAreaValue);
    if (text) {
      let nextValue = await keywordService.findList(text);
      nextValue = uniq(nextValue.map(item => value.find(v => v.label === item.label) || item));

      setTextAreaValue('');
      onChange(nextValue, nextValue, nextValue);
    }
  }

  function getValueItemColor(valueItem: IKeywordsTag): string {
    const valueType = getValueType(valueItem);
    const colorMap = {
      0: '#d15b47',
      2: '#82af6f'
    };
    return colorMap[valueType] || valueItem.color || '';
  }

  return (
    <div
      className="KeywordTextArea-root"
      style={{ height }}
      ref={wrapRef}
      onClick={handleWrapClick}
      onDoubleClick={handleWrapDbClick}
      title={title}
    >
      {contenteditable ? (
        <textarea
          placeholder={placeholder}
          className="KeywordTextArea-textarea"
          style={{ width: wrapRef.current.clientWidth - 2, height: wrapRef.current.clientHeight - 8 }}
          value={textAreaValue}
          onChange={e => setTextAreaValue(e.target.value)}
          onBlur={handleTextAreaBlur}
        />
      ) : (
        <>
          {value.map((o, index) => (
            <Tag
              className="KeywordTextArea-tag"
              color={getValueItemColor(o)}
              key={o.value}
              data-index={index}
              onClick={hybridClick}
              onDoubleClick={e => loop(e)}
            >
              {o.label}
            </Tag>
          ))}
          {added ? (
            <>
              <input
                ref={inputRef}
                className="KeywordTextArea-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleInputKeydown}
                onBlur={matchInputValue}
                placeholder={value.length === 0 ? placeholder : ''}
              />
              <span className="KeywordTextArea-inputMirror" ref={inputMirrorRef}>
                {inputValue}&nbsp;
              </span>
            </>
          ) : (
            value.length === 0 && <span>{placeholder}</span>
          )}
        </>
      )}
    </div>
  );
});
