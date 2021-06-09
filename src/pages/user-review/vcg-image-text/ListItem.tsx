import React, { ReactElement } from 'react';
import { Button, Input, Space } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';

interface Props {
  dataSource: any;
  index: number;
  onClick: any;
  selected: boolean;
}

export default function ListItem({ dataSource, selected, index, onClick }: Props): ReactElement {
  return (
    <GridItem
      cover={<img src={dataSource.oss176} />}
      indexProps={{ text: index + 1 + '', color: '#ff0000' }}
      height={400}
      onClick={onClick}
      selected={selected}
      actions={[
        { icon: <EditOutlined />, value: 'online', label: '上线' },
        { icon: <EllipsisOutlined />, value: 'online', label: '下线' }
      ]}
    >
      <GridItemRow label="dsfds" />
      <GridItemRow label="ID:">
        <a onClick={e => onClick('resId')}>{dataSource.resId}</a>
      </GridItemRow>
      <GridItemRow label="供应商:">{dataSource.resId}</GridItemRow>
      <GridItemRow label="供应商:">{dataSource.resId}</GridItemRow>
      <GridItemRow label="供应商:">{dataSource.resId}</GridItemRow>
      <GridItemRow>
        <div style={{ height: 46 }}>美丽的田园</div>
      </GridItemRow>
      <GridItemRow label="名字:">
        <Input size="small" placeholder="备注" />
      </GridItemRow>
      <GridItemRow>
        <Input size="small" placeholder="备注" />
      </GridItemRow>
    </GridItem>
  );
}
