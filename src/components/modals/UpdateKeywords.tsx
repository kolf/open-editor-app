import React, { ReactElement, useState } from 'react';
import { Menu, Dropdown, Radio, message } from 'antd';
import { DownOutlined, LineOutlined, FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons';

import KeywordTextAreaGroup, { ModeType } from 'src/components/KeywordTextAreaGroup';
import FindAndReplace from 'src/components/modals/FindAndReplace';
import PersonKeywords, { IKeywordProps } from 'src/components/modals/PersonKeywords';
import keywordService from 'src/services/keywordService';
import { uniq } from 'src/components/KeywordTextArea';
import * as tools from 'src/utils/tools';

export type IListItem = Pick<IImage, 'id' | 'keywordTags'>;

type Props<T> = {
  defaultList: T;
  onChange: (list: T) => void;
};

export default function UpdateKeywords({ defaultList, onChange }: Props<IListItem[]>): ReactElement {
  const [keywordMode, setKeywordMode] = useState<ModeType>('kind');
  const [list, setList] = useState(defaultList);

  const getValueByList = (list: IListItem[]): IKeywordsTag[] => {
    return uniq(
      list.reduce((result, item) => {
        const { keywordTags } = item;
        return [...result, ...keywordTags];
      }, [])
    );
  };

  const value = getValueByList(list);

  const personKeywordIdList: Array<number> = value.reduce((result, valueItem) => {
    if (/^\d+$/.test(valueItem.value)) {
      result.push(Number(valueItem.value));
    }
    return result;
  }, []);

  const handleChange = <T extends IKeywordsTag[]>(nextValue: T, addedValue: T, removedValue: T) => {
    const nextList = list.map(item => {
      const { keywordTags, id } = item;
      const nextKeywordTags = uniq(
        [...keywordTags, ...addedValue].filter(keywordTag => !removedValue.find(rv => rv.value === keywordTag.value))
      );

      return {
        id,
        keywordTags: nextKeywordTags
      };
    });

    setList(nextList);

    onChange(nextList);
  };

  const onReplace = async (findText: string, replaceText: string) => {
    const findLabelList = tools
      .trim(findText)
      .split(/,|，/)
      .filter(str => str);
    const newKeywordTags = await keywordService.findList(tools.trim(replaceText));
    if (findLabelList.length === 0) {
      message.info(`请输入要查找的关键词！`);
      return;
    }

    const nextList = list.map(item => {
      const { keywordTags, id } = item;
      const nextKeywordTags = uniq([...keywordTags.filter(k => !findLabelList.includes(k.label)), ...newKeywordTags]);
      return {
        id,
        keywordTags: nextKeywordTags
      };
    });

    setList(nextList);

    onChange(nextList);
  };

  const handlePersonKeywordClick = (checked: boolean, keyword: IKeywordProps) => {
    let addedValue = [];
    let removedValue = [];

    const newValue: IKeywordsTag[] = [{ value: keyword.id + '', label: keyword.cnname, kind: keyword.kind }];

    if (checked) {
      addedValue = newValue;
    } else {
      removedValue = newValue;
    }

    handleChange([], addedValue, removedValue);
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
            人相关词 <DownOutlined />
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
              <LineOutlined title="展示全部" />
            </Radio.Button>
            <Radio.Button value="source">
              <FileSearchOutlined title="按来源展示" />
            </Radio.Button>
            <Radio.Button value="kind">
              <UnorderedListOutlined title="按类型展示" />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <KeywordTextAreaGroup size="small" value={value} onChange={handleChange} mode={keywordMode} />
      <div style={{ position: 'relative', paddingLeft: 70, paddingTop: 12 }}>
        <label style={{ position: 'absolute', left: 0, top: 36 }}>查找&替换：</label>
        <FindAndReplace onFinish={onReplace} />
      </div>
    </>
  );
}
