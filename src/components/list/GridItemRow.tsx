import React, { ReactElement } from 'react';
import { Space } from 'antd';
interface Props {
  label?: ReactElement | string;
  children?: ReactElement[] | ReactElement | string;
}

export default React.memo(function GridItemRow({ label, children }: Props): ReactElement {
  return (
    <div className="grid-item-row">
      {label && <div className="grid-item-label">{label}</div>}
      {children && <div className="grid-item-control">{children}</div>}
    </div>
  );
});
