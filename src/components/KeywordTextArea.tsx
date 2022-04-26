import React, { ReactElement, useState, useCallback, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button, message, Tag, Input } from 'antd';
import Loading from 'src/components/common/LoadingBlock';
import KeywordDetails from 'src/components/modals/KeywordDetails';
import KeywordSelectTable from 'src/components/modals/KeywordSelectTable';
import modal from 'src/utils/modal';
import * as tools from 'src/utils/tools';
import { useDoubleClick } from 'src/hooks/useDoubleClick';
import keywordService from 'src/services/keywordService';
import 'src/styles/KeywordTextArea.less';

const TextArea = Input.TextArea;

type actionType = 'add' | 'remove' | 'select';

type Props<T> = {
  title: string;
  placeholder?: string;
  height?: number;
  langType?: IImage['osiKeywodsData']['langType'];
  value: T[];
  action?: actionType[];
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

const defaultAction: actionType[] = ['add', 'remove', 'select'];

export default React.memo(function KeywordTextArea({
  value,
  title,
  placeholder,
  height = 100,
  action = defaultAction,
  langType,
  onChange
}: Props<IKeywordsTag>): ReactElement {
  const { formatMessage } = useIntl();
  const wrapRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputMirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [contenteditable, setContenteditable] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const hybridClick = useDoubleClick(showDetails, onDeleteValue);
  const added = action.includes('add');
  const defaultPlaceholder = formatMessage({ id: 'keywords.textarea.placeholder' });

  useEffect(() => {
    if (inputRef.current) {
      const width = value.length === 0 && !inputValue ? 148 : inputMirrorRef.current.clientWidth;
      inputRef.current.style.width = Math.min(wrapRef.current.clientWidth - 4, width) + 'px';
    }
  }, [inputValue, inputRef, value]);

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
    const { value: id, type } = value[index];

    if (type === 0) {
      message.info(formatMessage({ id: 'keywords.nodata' }));
      return;
    }

    if (type === 2) {
      onSelectValue(index);
      return;
    }

    const mod = modal({
      width: 600,
      title: formatMessage({ id: 'keywords.modal.details' }),
      content: <Loading />,
      footer: null
    });

    try {
      const res = await keywordService.getList(id);
      mod.update({
        content: <KeywordDetails dataSource={res[0]} />
      });
    } catch (error) {
      mod.close();
    }
  }

  async function onSelectValue(index: number) {
    const valueItem = value[index];

    const mod = modal({
      width: 800,
      title: formatMessage({ id: 'keywords.modal.select' }),
      content: <Loading />,
      footer: null
    });

    try {
      const res = await keywordService.getList(valueItem.value);
      let contentValue: IdList = [];

      mod.update({
        content: <KeywordSelectTable dataSource={res} onChange={value => (contentValue = value)} />,
        footer: action.includes('select') ? (
          <>
            <Button onClick={mod.close}>
              <FormattedMessage id="modal.cancelText" />
            </Button>
            <Button type="primary" onClick={onOk}>
              <FormattedMessage id="modal.okText" />
            </Button>
          </>
        ) : null
      });

      function onOk() {
        const addedValue = res
          .filter(r => contentValue.includes(r.id))
          .map(item => ({
            value: item.id + '',
            label: item[langType === 2 ? 'enname' : 'cnname'],
            kind: item.kind,
            type: 1 as IKeywordsTag['type']
          }));
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

  function onDeleteValue(e) {
    const index: number = e.target.dataset.index * 1;
    const nextValue = value.filter((item, i) => i !== index);
    onChange(nextValue, [], [value[index]]);
  }

  async function handleInputKeydown(e) {
    const { keyCode } = e;

    if (keyCode === 8 && !inputValue) {
      const lastValue = value.pop();
      onChange([...value], [], [lastValue]);
      return;
    }

    if (keyCode === 13 || keyCode === 188) {
      matchInputValue();
    }
  }

  async function handleTextAreaBlur() {
    console.log('error');
    await matchTextAreaValue();
    setContenteditable(false);
  }

  async function matchInputValue() {
    const text = tools.trim(inputValue);
    if (text) {
      const addedValue = await keywordService.findList(text, langType);
      const nextValue = uniq([...value, ...addedValue]);
      setInputValue('');
      onChange(nextValue, addedValue, []);
    }
  }

  async function matchTextAreaValue() {
    const text = tools.trim(textAreaValue);
    let nextValue: IKeywordsTag[] = [];
    let addedValue: IKeywordsTag[] = [];
    let removedValue: IKeywordsTag[] = [...value];

    if (text) {
      const newValue = await keywordService.findList(text, langType);
      nextValue = uniq(newValue.map(item => value.find(v => v.label === item.label) || item));

      addedValue = nextValue.filter(nv => !value.find(v => v.value === nv.label));

      removedValue = value.filter(v => !nextValue.find(nv => nv.value === v.value));
      setTextAreaValue('');
    }

    onChange(nextValue, addedValue, removedValue);
  }

  function getValueItemColor(valueItem: IKeywordsTag): string {
    const colorMap = {
      0: 'red',
      2: 'green'
    };
    return colorMap[valueItem.type] || valueItem.color || '';
  }

  useEffect(() => {
    if (contenteditable) {
      textareaRef.current.style.height = textareaRef.current.scrollHeight+'px';
    }
  }, [contenteditable])

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
          ref={textareaRef}
          placeholder={placeholder || defaultPlaceholder}
          className="KeywordTextArea-textarea"
          style={{ width: wrapRef.current.clientWidth - 4, height: wrapRef.current.clientHeight - 8 }}
          defaultValue={textAreaValue}
          onChange={e => setTextAreaValue(e.target.value)}
          onBlur={handleTextAreaBlur}
        />
      ) : (
        <>
          {value.map((o, index) => (
            <Tag
              title={o.label}
              className="KeywordTextArea-tag"
              color={getValueItemColor(o)}
              key={o.value + '-' + index}
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
                placeholder={value.length === 0 ? placeholder || defaultPlaceholder : ''}
              />
              <span className="KeywordTextArea-inputMirror" ref={inputMirrorRef}>
                {inputValue}&nbsp;
              </span>
            </>
          ) : (
            value.length === 0 && <span>{placeholder || defaultPlaceholder}</span>
          )}
        </>
      )}
    </div>
  );
});
