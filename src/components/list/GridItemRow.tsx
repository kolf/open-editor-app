import React, { CSSProperties, ReactElement } from 'react';
import { Space } from 'antd';
interface Props {
  label?: ReactElement | string;
  children?: ReactElement[] | ReactElement | string;
  childrenStyle?: CSSProperties;
  childrenTitle?: string
}

export default React.memo(function GridItemRow({ label, children, childrenStyle = {}, childrenTitle='' }: Props): ReactElement {
  return (
    <div className="grid-item-row">
      {label && <div className="grid-item-label">{label}</div>}
      {children && <div className="grid-item-control" style={childrenStyle} title={childrenTitle}>{children}</div>}
    </div>
  );
});
