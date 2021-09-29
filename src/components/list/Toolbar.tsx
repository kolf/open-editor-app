import React, { ReactElement } from 'react';
import { Affix, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Pager, { Props as IPager } from 'src/components/Pager';
import './Toolbar.less';

const selectOptions: Option[] = ['全选', '反选', '取消'].map((o, i) => ({
  value: i + '',
  label: o
}));

interface Props {
  selectedIds?: IdList;
  idList?: IdList;
  onSelectIds?: (idList: IdList) => void;
  onRefresh?: () => void;
  children?: ReactElement;
  pagerProps?: IPager;
  extraContent?: React.ReactNode;
}

function Toolbar({
  selectedIds = [],
  idList,
  children,
  onSelectIds,
  onRefresh,
  pagerProps,
  extraContent
}: Props): ReactElement {
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
    <Affix offsetTop={64}>
      <div className="toolbar-root">
        <div className="toolbar-left">
          {onSelectIds && (
            <Space style={{ paddingRight: 6 }}>
              {selectOptions.map(o => (
                <a key={o.value} onClick={e => handleClick(o.value)}>
                  {o.label}
                </a>
              ))}
              <span>已选中{selectedIds.length}个</span>
            </Space>
          )}
          {onRefresh && (
            <Button
              style={{ backgroundColor: '#eee' }}
              size="small"
              icon={<ReloadOutlined />}
              onClick={e => {
                onRefresh();
              }}
            />
          )}
        </div>
        <div className="toolbar-content">{children}</div>
        <div className="toolbar-right">
          {extraContent && <span style={{ paddingRight: 6 }}>{extraContent}</span>}
          <Pager {...pagerProps} />
        </div>
      </div>
    </Affix>
  );
}

export default Toolbar;
