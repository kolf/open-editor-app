import React, { ReactElement } from 'react';
import { useRequest } from 'ahooks';
import { Tag } from 'antd';
import Loading from 'src/components/common/LoadingBlock';
import keywordService from 'src/services/keywordService';
import dataSource from 'src/assets/json/personKeywordList.json';
export interface IKeyword {
  id: number;
  kind: IKeywordsTag['kind'];
  cnname: string;
  enname: string;
}

//
interface IPersonKeyword {
  vcg_keyword_id: number;
  getty_keyword_id: number;
  cnname: string;
  enname: string;
}

interface Props {
  langType: IImage['osiKeywodsData']['langType'];
  value: IdList;
  onChange: (checked: boolean, clickedKeyword: IKeyword) => void; // TODO 无法使用onClick?
}

const keywordIdList: IdList = (dataSource as { name: string; id: number; children: IPersonKeyword[] }[]).reduce(
  (result, item) => {
    const idList = item.children.map(c => c.vcg_keyword_id);
    return [...result, ...idList];
  },
  []
);

export default React.memo(function PersonKeywords({
  langType,
  value: propsValue,
  onChange: onClick
}: Props): ReactElement {
  const { data = [], loading = true }: { data: IKeyword[]; loading: boolean } = useRequest(
    () => keywordService.getList(keywordIdList.join(',')),
    {
      throwOnError: true
    }
  );

  const isKeyword = (id: number): boolean => {
    return !!data.find((item: IKeyword) => item.id === id);
  };

  const getKeywordList = (idList: IdList): IKeyword[] => {
    return data.filter(item => idList.includes(item.id));
  };

  const isChecked = (value: IKeyword[], id: number): boolean => {
    return !!value.find(v => v.id === id);
  };

  const handleClick = (id: IPersonKeyword['vcg_keyword_id'], e: React.MouseEvent<HTMLSpanElement>): void => {
    e.preventDefault();

    const checked = !isChecked(value, id);
    const keywordList = getKeywordList([id]);
    onClick(checked, keywordList[0]);
  };

  if (loading) {
    return <Loading />;
  }

  const value = getKeywordList(propsValue);

  return (
    <>
      {dataSource.map(item => (
        <div key={item.id} style={{ padding: '6px 0' }}>
          {item.children
            .filter(keyword => isKeyword(keyword.vcg_keyword_id))
            .map((keyword: IPersonKeyword) => (
              <Tag
                color={isChecked(value, keyword.vcg_keyword_id) ? '#ccc' : null}
                key={keyword.vcg_keyword_id}
                style={{ marginBottom: 4 }}
                onClick={e => handleClick(keyword.vcg_keyword_id, e)}
              >
                {keyword[langType === 1 ? 'cnname' : 'enname']}
              </Tag>
            ))}
        </div>
      ))}
    </>
  );
});
