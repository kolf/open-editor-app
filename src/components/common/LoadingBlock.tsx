import React, { ReactElement } from 'react';
import { Spin } from 'antd';

interface Props {
  height?: number;
}

const defaultProps = {
  height: 200
};

function LoadingBlock({ height }: Props): ReactElement {
  return (
    <Spin spinning>
      <div style={{ height }} />
    </Spin>
  );
}

LoadingBlock.defaultProps = defaultProps;

export default LoadingBlock;
