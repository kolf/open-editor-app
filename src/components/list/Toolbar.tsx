import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Affix, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Pager, { Props as IPager } from 'src/components/Pager';
import { useLanguagePkg } from 'src/hooks/useLanguage';
import './Toolbar.less';

type ISelectType = '0' | '1' | '2';

interface Props {
  selectedIds?: IdList;
  idList?: IdList;
  onSelectIds?: (idList: IdList) => void;
  onRefresh?: () => void;
  children?: ReactElement;
  pagerProps?: IPager;
  extraContent?: React.ReactNode;
}

export default React.memo(function Toolbar({
  selectedIds = [],
  idList,
  children,
  onSelectIds,
  onRefresh,
  pagerProps,
  extraContent
}: Props): ReactElement {
  const { languagePkg } = useLanguagePkg();
  const options = [
    {
      label: languagePkg['pager.select.all'],
      value: '0'
    },
    {
      label: languagePkg['pager.select.invert'],
      value: '1'
    },
    {
      label: languagePkg['pager.select.cancel'],
      value: '2'
    }
  ];

  const handleClick = (key: ISelectType) => {
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
              {options.map(o => (
                <a key={o.value} onClick={e => handleClick(o.value as ISelectType)}>
                  {o.label}
                </a>
              ))}
              <span>
                <FormattedMessage id="pager.select.total" values={{ total: selectedIds.length }} />
              </span>
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
});
