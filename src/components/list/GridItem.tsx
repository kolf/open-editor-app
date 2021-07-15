import React, { ReactElement } from 'react';
import { Space, Button, Tag, Tooltip, Popover } from 'antd';
import Iconfont from 'src/components/Iconfont';
import className from 'classnames';

function loop(e) {}

interface Props {
  onClick?: any;
  cover: any;
  indexProps: any;
  actions?: any;
  coverActions?: any;
  children?: any;
  selected?: boolean;
  style?: any;
  height: number;
}

const defaultProps = {
  onClick: () => {},
  indexProps: {},
  coverActions: [
    {
      value: 'showMiddleImage',
      label: '查看中图',
      icon: 'icon-tupian'
    },
    {
      value: 'openOriginImage',
      label: '查看原图',
      icon: 'icon-xiangjipaizhao'
    }
  ]
};

const TopTag = ({ children, align, color, onClick }) => {
  let style = null;
  if (align === 'left') {
    style = { left: 0 };
  } else if (align === 'right') {
    style = { right: -8 };
  }
  return (
    <Tag color={color} style={style} className="grid-item-topTag" title={children} onClick={onClick}>
      {children}
    </Tag>
  );
};

const CoverActions = ({ dataSource, onClick }) => {
  return (
    <div className="grid-item-cover-actions">
      {dataSource.map(o => (
        <Tooltip key={o.value} title={o.label}>
          <Iconfont type={o.icon} onClick={e => onClick(o.value)} />
        </Tooltip>
      ))}
    </div>
  );
};

const GridItem = ({
  onClick,
  cover,
  indexProps,
  coverActions,
  actions,
  children,
  height,
  selected
}: Props): ReactElement => {
  return (
    <div className={className('grid-item-root', { active: selected })} style={{ height }}>
      <div className="grid-item-header">
        <div className="grid-item-cover" onClick={e => onClick('cover')}>
          {cover}
        </div>
        {coverActions && <CoverActions dataSource={coverActions} onClick={onClick} />}
      </div>
      {children}
      <div className="grid-item-footer">
        <div className="grid-item-actions">
          {actions && (
            <Space>
              {actions.map(action => (
                <Button
                  disabled={action.disabled}
                  title={action.disabled ? '等待社区审核中' :action.label}
                  key={action.value}
                  size="small"
                  icon={action.icon}
                  onClick={e => onClick(action.value)}
                />
              ))}
            </Space>
          )}
        </div>
        <div className="grid-item-index">
          <span title={indexProps.title} style={{ color: indexProps.color }}>
            {indexProps.text}
          </span>
        </div>
      </div>
      {}
    </div>
  );
};

GridItem.defaultProps = defaultProps;

GridItem.TopTag = TopTag;

export default GridItem;
