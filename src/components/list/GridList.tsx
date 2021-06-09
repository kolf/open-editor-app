import React, { ReactElement } from 'react';
import { Spin, Row, Col, Empty } from 'antd';
import './GridList.scss'

const layout = {
  xs: 12,
  sm: 8,
  md: 6,
  lg: 6,
  xl: 4,
  xxl: 3
};

interface Props {
  dataSource: any;
  renderItem: any;
  loading: boolean;
  rowKey: string;
}

const defaultProps = {
  rowKey: 'id'
};

function GridList({ dataSource, renderItem, rowKey, loading }: Props): ReactElement {
  if (loading) {
    return (
      <Spin tip="加载中...">
        <div className="grid-loading"></div>
      </Spin>
    );
  }
  if (dataSource.length === 0) {
    return <Empty description="暂无数据" />;
  }
  return (
    <div className="grid-list-root">
      <Row gutter={16}>
        {dataSource.map((item, index) => (
          <Col key={item[rowKey]} {...layout}>
            {renderItem(item, index)}
          </Col>
        ))}
      </Row>
    </div>
  );
}

GridList.defaultProps = defaultProps;

export default GridList;
