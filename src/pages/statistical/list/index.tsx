import { useRequest } from 'ahooks';
import { DatePicker, Form, Table } from 'antd';
import React, { useState, memo } from 'react';
import config from 'src/config';
import { StatisticJobSchema } from 'src/declarations/schemas/StatisticJobSchema';
import { useDocumentTitle } from 'src/hooks/useDom';
import statisticJobService from 'src/services/statisticJobService';

const columns: Column<StatisticJobSchema.ListALl>[] = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '编辑',
    dataIndex: 'userName'
  },
  // {
  //   title: '待审核数量',
  //   dataIndex: '---',
  //   render: () => '---'
  // },
  {
    title: '审核通过数量',
    dataIndex: 'passTotal'
  },
  {
    title: '审核驳回数量',
    dataIndex: 'dismissTotal'
  },
  {
    title: '共计',
    dataIndex: 'total',
    render: (value, tr) =>  tr.passTotal + tr.dismissTotal
  },
];
// .map<Column>(c => ({...c, align: 'center'}));

function Statistic() {
  useDocumentTitle('统计-数据审核统计-VCG内容审核管理平台');
  const [query, setQuery] = useState({ createdTime: null });

  const { data = [], loading, run: refreshData } = useRequest(statisticJobService.getList, { manual: true });

  const formListOnChange = values => {
    const nextQuery = { ...values };
    const result = Object.keys(nextQuery).reduce(
      (memo, q) => {
        switch (q) {
          case 'createdTime':
            if (nextQuery[q]) {
              const [start, end] = nextQuery[q];
              memo[q] = {
                from: start.format(config.data.SECOND_FORMAT),
                to: end.format(config.data.SECOND_FORMAT)
              }
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

    if (result.createdTime) {
      refreshData(result.createdTime);
    }
  };

  return (
    <>
      <Form layout="inline" onValuesChange={formListOnChange} className="formList-list">
        <Form.Item name="createdTime" className="form-list-item">
          <DatePicker.RangePicker placeholder={['审核时间', '']} separator={query.createdTime ? '~' : ''} />
        </Form.Item>
      </Form>
      <Table
        pagination={false}
        dataSource={data.map((l, i) => ({ ...l, ...{ index: i + 1 } }))}
        columns={columns}
        bordered
        loading={loading}
      />
    </>
  );
}

export default memo(Statistic);