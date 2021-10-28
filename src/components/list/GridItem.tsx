import React, { ReactElement, CSSProperties } from 'react';
import { Space, Button, Tag, Tooltip, Popover } from 'antd';
import Iconfont from 'src/components/Iconfont';
import className from 'classnames';
import { useIntl } from 'react-intl';

interface IIndexProps {
  title: string;
  color: string;
  text: string;
}
interface IAction {
  label: string;
  value: IImageActionType;
  icon: ReactElement | string;
}

type Props = {
  onClick?: (value: IImageActionType) => void;
  cover: ReactElement;
  indexProps: IIndexProps;
  actions?: (IAction & { disabledMessage?: string })[];
  coverActions?: IAction[];
  children?: ReactElement[] | ReactElement;
  selected?: boolean;
  style?: CSSProperties;
  height: number;
};

// TODO
const TopTag = ({
  children,
  align,
  color,
  onClick
}: {
  children: string;
  align: string;
  color: string;
  onClick?: any;
}) => {
  let style = null;
  if (align === 'left') {
    style = { left: 0 };
  } else if (align === 'right') {
    style = { right: -8 };
  }
  return (
    <Tag
      color={color}
      style={style}
      className="grid-item-topTag active"
      title={children}
      onClick={onClick}
      onClose={e => e.preventDefault()}
    >
      {children}
    </Tag>
  );
};

const GridItem = ({
  onClick = () => {},
  cover,
  indexProps,
  coverActions: propsCoverActions,
  actions,
  children,
  height,
  selected
}: Props): ReactElement => {
  const { formatMessage } = useIntl();

  const coverActions = propsCoverActions || [
    {
      value: 'middleImage',
      label: formatMessage({ id: 'image.action.showMiddleImage' }),
      icon: 'icon-tupian'
    },
    {
      value: 'originImage',
      label: formatMessage({ id: 'image.action.openOriginImage' }),
      icon: 'icon-xiangjipaizhao'
    }
  ];

  return (
    <div className={className('grid-item-root', { active: selected })} style={{ height }}>
      <div className="grid-item-header">
        <div className="grid-item-cover" onClick={e => onClick('cover')}>
          {cover}
        </div>
        {coverActions && (
          <div className="grid-item-cover-actions">
            {coverActions.map(o => (
              <Tooltip key={o.value} title={o.label}>
                <Iconfont type={o.icon as string} onClick={e => onClick(o.value)} />
              </Tooltip>
            ))}
          </div>
        )}
      </div>
      {children}
      <div className="grid-item-footer">
        <div className="grid-item-actions">
          {actions && (
            <Space>
              {actions.map(action => (
                <Button
                  disabled={!!action.disabledMessage}
                  title={action.disabledMessage || action.label}
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
    </div>
  );
};

GridItem.TopTag = TopTag;

export default GridItem;
