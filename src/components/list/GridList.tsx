import React, { ReactElement } from 'react';
import { Spin, Row, Col, Empty } from 'antd';
import './GridList.scss';

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
  rowKey?: string;
  error?: string;
}

const defaultProps = {
  rowKey: 'id',
  dataSource: []
};

function GridList({ dataSource, renderItem, rowKey, loading, error }: Props): ReactElement {
  if (loading) {
    return (
      <Spin tip="加载中...">
        <div className="grid-loading"></div>
      </Spin>
    );
  }
  if (dataSource.length === 0) {
    return (
      <div style={{ padding: '48px 0' }}>
        <Empty description="可能这个资源已经飞走了，请修改搜索条件" />
      </div>
    );
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
