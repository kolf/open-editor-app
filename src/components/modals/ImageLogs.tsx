import * as React from 'react';
import { Table } from 'antd';
import { useIntl } from 'react-intl';

interface Props {
  dataSource: any;
}

export default React.memo(function ImageLogs({ dataSource }: Props): React.ReactElement {
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: formatMessage({ id: 'image.log.date' }),
      dataIndex: 'createdTime',
      width: 130
    },
    {
      title: formatMessage({ id: 'image.log.user' }),
      dataIndex: 'userName',
      width: 120
    },
    {
      title: formatMessage({ id: 'image.log.actions' }),
      dataIndex: 'message'
    }
  ];

  return <Table rowKey="id" dataSource={dataSource} size="small" pagination={false} columns={columns} />;
});
