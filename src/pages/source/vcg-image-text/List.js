import React, { Component } from 'react';
import { Space, Row, Col, Button, Pagination } from 'antd';
import queryString from 'query-string';
import FlatList from 'components/FlatList/FlatList';
import FormList from './FormList';
import ListItem from './ListItem';

export default class List extends Component {
  state = {
    listData: [],
    total: 0,
    query: {},
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async newQuery => {
    const { query } = this.state;
    const nextQuery = {
      ...query,
      ...newQuery,
    };
    this.setState({ query: nextQuery, isFetching: true });
    try {
      const res = await this.props.fetch(`/graphql`, {
        body: JSON.stringify({
          query: `{images(input: "${queryString.stringify(
            this.makeQuery(nextQuery),
          )}"){list{id,resId,poolId,oss176,caption,uploadTime,title,keywordsAuditStatus,keywords,ambiguityKeywords,urgent}total
        }}`,
        }),
      });
      const {
        data: {
          images: { list, total },
        },
      } = res;
      this.setState({ listData: list, total, isFetching: false });
    } catch (error) {
      this.setState({ isFetching: false });
    }
  };

  makeQuery = query => {
    let result = Object.keys(query).reduce(
      (result, key) => {
        const value = query[key];
        if (Array.isArray(value)) {
          result[key] = value.map(item => item.key).join(',');
        } else if (typeof value === 'object') {
          result[key] = value.key;
        } else if (value) {
          result[key] = value;
        }
        return result;
      },
      {
        sortfield: 'createdTime',
        keywordsAuditOutsource: 100002000,
        pageNum: 1,
        pageSize: 60,
        type: 2,
      },
    );

    if (!query.keywordsAuditStatus) {
      result.keywordsAuditStatus = '1,2,3,4,5';
    }

    return result;
  };

  handleItemClick = (index, field) => {};

  render() {
    const { listData, isFetching } = this.state;

    return (
      <div>
        <FormList onChange={this.loadData} />
        <div style={{ paddingTop: 12 }}>
          <Row>
            <Col flex="auto" style={{ paddingTop: 3 }}>
              <Space>
                <a>全选</a>
                <a>反选</a>
                <a>取消</a>
                <span>已选中</span>
                <span>81</span>
                <span>张</span>
              </Space>
            </Col>
            <Col flex="360px" style={{ textAlign: 'right' }}>
              <Space>
                <Pagination
                  size="small"
                  total={50}
                  showSizeChanger
                  showQuickJumper
                />
              </Space>
            </Col>
          </Row>
        </div>
        <FlatList
          dataSource={listData}
          isLoading={isFetching}
          renderItem={(item, index) => (
            <ListItem
              dataSource={item}
              onClick={this.handleItemClick}
              index={index}
            />
          )}
        />
      </div>
    );
  }
}
