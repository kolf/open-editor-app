import React, { ReactElement, useState } from 'react';
import { Menu, Dropdown, Radio, message } from 'antd';
import { DownOutlined, LineOutlined, FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons';

import KeywordTextAreaGroup, {
  ModeType,
  removedSourceTypeReg,
  updateValueSource
} from 'src/components/KeywordTextAreaGroup';
import FindAndReplace from 'src/components/modals/FindAndReplace';
import PersonKeywords, { IKeyword } from 'src/components/modals/PersonKeywords';
import keywordService from 'src/services/keywordService';
import { uniq } from 'src/components/KeywordTextArea';
import * as tools from 'src/utils/tools';
import { useIntl, FormattedMessage } from 'react-intl';

export type IListItem = Required<Pick<IImage, 'id' | 'keywordTags'>>;

type Props<T> = {
  defaultList: T;
  onChange: (list: T) => void;
};

export default React.memo(function UpdateKeywords({ defaultList, onChange }: Props<IListItem[]>): ReactElement {
  const { formatMessage } = useIntl();
  const [keywordMode, setKeywordMode] = useState<ModeType>('source');
  const [list, setList] = useState(defaultList);

  const getValueByList = (list: IListItem[]): IKeywordsTag[] => {
    return list.reduce((result, item) => {
      const { keywordTags } = item;
      keywordTags.forEach(k => {
        const index = result.findIndex(r => r.value === k.value);
        if (index !== -1) {
          if (k.type === 1) {
            result[index] = { ...k, color: 'gold' };
          }
        } else {
          result.push(k);
        }
      });
      return result;
    }, []);
  };

  const value = keywordService.sort(getValueByList(list));

  const personKeywordIdList: Array<number> = value.reduce((result, valueItem) => {
    if (/^\d+$/.test(valueItem.value)) {
      result.push(Number(valueItem.value));
    }
    return result;
  }, []);

  const handleChange = <T extends IKeywordsTag[]>(nextValue: T, addedValue: T, removedValue: T) => {
    // console.log(nextValue, addedValue, removedValue, 'value');
    const nextList = list.map(item => {
      const { keywordTags, id } = item;
      const nextKeywordTags = uniq([
        ...keywordTags
          .map(k => nextValue.find(nv => nv.value === k.value) || k)
          .filter(k => !removedValue.find(rv => rv.value === k.value)),
        ...addedValue
      ]);

      return {
        id,
        keywordTags: nextKeywordTags.map(k => ({ ...k, color: null }))
      };
    });

    setList(nextList);

    onChange(nextList);
  };

  const onReplace = async (searchValue: string, replaceValue: string) => {
    const searchLabelList: IKeywordsTag['label'][] = tools
      .trim(searchValue)
      .split(/,|，/)
      .filter(str => str);
    const newKeywordTags: IKeywordsTag[] = await keywordService.findList(tools.trim(replaceValue));
    if (searchLabelList.length === 0) {
      message.info(`请输入要查找的关键词！`);
      return;
    }

    const nextList = list.map(item => {
      const { keywordTags, id } = item;

      const removedKeywordTags = keywordTags.filter(
        k => searchLabelList.includes(k.label) && !removedSourceTypeReg.test(k.source)
      );

      const addedKeywordTags = newKeywordTags.filter(nk => !keywordTags.find(k => k.value === nk.value));

      const nextKeywordTags = [
        ...keywordTags.filter(k => !removedKeywordTags.find(rv => rv.value === k.value)),
        ...addedKeywordTags
      ];

      // const nextKeywordTags = uniq([...keywordTags.filter(k => !searchLabelList.includes(k.label)), ...newKeywordTags]);
      return {
        id,
        keywordTags: updateValueSource(keywordTags, nextKeywordTags)[0]
      };
    });

    setList(nextList);

    onChange(nextList);
  };

  const handlePersonKeywordClick = (checked: boolean, keyword: IKeyword) => {
    const newValue: IKeywordsTag = { value: keyword.id + '', label: keyword.cnname, kind: keyword.kind, type: 1 };
    const nextValue = checked ? [...value, newValue] : value.filter(v => v.value !== newValue.value);
    handleChange(...updateValueSource(value, nextValue));
  };

  const personKeywordsOverlay = (
    <Menu style={{ padding: 16, width: 712 }}>
      <PersonKeywords value={personKeywordIdList} onChange={handlePersonKeywordClick} />
    </Menu>
  );

  return (
    <>
      <div>
        <Dropdown overlay={personKeywordsOverlay} arrow>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <FormattedMessage id="updateKeywords.personKeyword" /> <DownOutlined />
          </a>
        </Dropdown>
        <div style={{ float: 'right', paddingBottom: 6 }}>
          <Radio.Group
            size="small"
            defaultValue={keywordMode}
            onChange={e => {
              setKeywordMode(e.target.value);
            }}
          >
            <Radio.Button value="all">
              <LineOutlined title={formatMessage({ id: 'keywords.mode.all' })} />
            </Radio.Button>
            <Radio.Button value="source">
              <FileSearchOutlined
                title={formatMessage({
                  id: 'keywords.mode.source'
                })}
              />
            </Radio.Button>
            <Radio.Button value="kind">
              <UnorderedListOutlined title={formatMessage({ id: 'keywords.mode.kind' })} />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <KeywordTextAreaGroup size="small" value={value} onChange={handleChange} mode={keywordMode} />
      <div style={{ position: 'relative', paddingLeft: 70, paddingTop: 12 }}>
        <label style={{ position: 'absolute', left: 0, top: 36 }}>
          <FormattedMessage id="findAndReplace" />：
        </label>
        <FindAndReplace onFinish={onReplace} />
      </div>
    </>
  );
});
