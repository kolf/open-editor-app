import { useRequest } from 'ahooks';
import { DatePicker, Form, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState, memo } from 'react';
import Toolbar from 'src/components/list/Toolbar';
import config from 'src/config';
import { useDocumentTitle } from 'src/hooks/useDom';
import bacthService from 'src/services/batchService';

const columns: Column[] = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: 'ID',
    dataIndex: 'index'
  },
  {
    title: '编辑',
    dataIndex: 'user'
  },  {
    title: '待审核数量',
    dataIndex: 'number'
  },
  {
    title: '审核通过数量',
    dataIndex: 'number'
  },
  {
    title: '审核驳回数量',
    dataIndex: 'number'
  },
  {
    title: '共计'
  }
];

function Statistic() {
  useDocumentTitle('统计-数据审核统计-VCG内容审核管理平台');
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });

  const {
    data = { list: [], total: 0 },
    loading,
    run: refreshData
  } = useRequest(bacthService.getList, { manual: true });

  useEffect(() => {
    refreshData(query);
  }, [query]);

  const formListOnChange = values => {
    const nextQuery = { ...values, pageNum: 1 };
    const result = Object.keys(nextQuery).reduce(
      (memo, q) => {
        switch (q) {
          case 'createdTime':
            if (nextQuery[q]) {
              const date = moment(nextQuery[q]).format(config.data.DATE_FORMAT);
              memo[q] = `${date} 00:00:00,${date} 23:59:59`;
            } else {
              Reflect.deleteProperty(memo, q);
            }
            break;
          default:
            memo[q] = nextQuery[q];
        }
        return memo;
      },
      { ...query }
    );
    setQuery(result);
  };

  return (
    <>
      <Form layout="inline" onValuesChange={formListOnChange} className="formList-list">
        <Form.Item name="createdTime" className="form-list-item">
          <DatePicker placeholder="入库时间" />
        </Form.Item>
      </Form>
      <Toolbar
        pagerProps={{
          total: data.total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: values => {
            setQuery({ ...query, ...values });
          }
        }}
      ></Toolbar>
      <Table
        pagination={false}
        dataSource={data.list.map((l, i) => ({ ...l, ...{ index: i } }))}
        columns={columns}
        bordered
        loading={loading}
      />
    </>
  );
}

export default memo(Statistic);
