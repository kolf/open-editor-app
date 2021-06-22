import React, { ReactElement } from 'react';
import { Affix, Space } from 'antd';
import Pager, { IPagerProps } from 'src/components/Pager';
import './Toolbar.less';

const selectOptions = ['全选', '反选', '取消'].map((o, i) => ({
  value: i + '',
  label: o
}));

interface Props {
  selectedIds?: number[];
  idList?: number[];
  onSelectIds?: (args: number[]) => void;
  children?: ReactElement;
  pagerProps?: IPagerProps;
}

function Toolbar({ selectedIds = [], idList, children, onSelectIds, pagerProps }: Props): ReactElement {
  const handleClick = key => {
    let nextSelectedIds = [];
    switch (key) {
      case '0':
        nextSelectedIds = [...idList];
        break;
      case '1':
        nextSelectedIds = idList.filter(id => !selectedIds.includes(id));
        break;
    }

    onSelectIds(nextSelectedIds);
  };
  return (
    <Affix>
      <div className="toolbar-root">
        <div className="toolbar-left">
          {onSelectIds && (
            <Space>
              {selectOptions.map(o => (
                <a key={o.value} onClick={e => handleClick(o.value)}>
                  {o.label}
                </a>
              ))}
              <span>已选中{selectedIds.length}个</span>
            </Space>
          )}
        </div>
        <div className="toolbar-content">{children}</div>
        <div className="toolbar-right">
          <Pager {...pagerProps} />
        </div>
      </div>
    </Affix>
  );
}

export default Toolbar;
