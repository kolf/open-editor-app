import React, { ReactElement } from 'react';
import { Spin, Row, Col, Empty } from 'antd';
import './GridList.less';

const layout = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
  xl: 6,
  xxl: 4
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
      <Row gutter={8}>
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
