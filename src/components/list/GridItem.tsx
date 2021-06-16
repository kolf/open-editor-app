import React, { ReactElement } from 'react';
import { Space, Button } from 'antd';
import className from 'classnames';

function loop(e) {}

interface Props {
  onClick?: any;
  cover: any;
  indexProps: any;
  actions?: any;
  children?: any;
  selected?: boolean;
  style?: any;
  height: number;
}

const defaultProps = {
  onClick: () => {},
  indexProps: {}
};

function GridItem({ onClick, cover, indexProps, actions, children, height, selected }: Props): ReactElement {
  return (
    <div className={className('grid-item-root', { active: selected })} style={{ height }}>
      <div className="grid-item-header">
        <div className="grid-item-cover" onClick={e => onClick('cover')}>
          {cover}
        </div>
      </div>
      {children}
      <div className="grid-item-footer">
        <div className="grid-item-actions">
          <Space>
            {actions.map(action => (
              <Button
                title={action.title}
                key={action.value}
                size="small"
                icon={action.icon}
                onClick={e => onClick(action.value)}
              />
            ))}
          </Space>
        </div>
        <div className="grid-item-index">
          <span title={indexProps.title} style={{ color: indexProps.color }}>
            {indexProps.text}
          </span>
        </div>
      </div>
    </div>
  );
}

GridItem.defaultProps = defaultProps;

export default GridItem;
