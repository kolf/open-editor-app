import React, { ReactElement } from 'react';
import { Space } from 'antd';
interface Props {
  label?: any;
  children?: any;
}

export default function GridItemRow({ label, children }: Props): ReactElement {
  return (
    <div className="grid-item-row">
      {label && <div className="grid-item-label">{label}</div>}
      {children && <div className="grid-item-control">{children}</div>}
    </div>
  );
}
