import React, { ReactElement } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
const { Option } = Select;
const copyrightOptions = [
  {
    value: '1',
    label: 'RM'
  },
  {
    value: '2',
    label: 'RF'
  }
];

interface Props {
  dataSource: any;
  index: number;
  onClick: any;
  onChange: any;
  selected: boolean;
}

export default function ListItem({ dataSource, selected, index, onClick, onChange }: Props): ReactElement {
  return (
    <GridItem
      cover={<img src={dataSource.urlSmall} />}
      indexProps={{ text: index + 1 + '', color: '#ff0000' }}
      height={430}
      onClick={onClick}
      selected={selected}
      actions={[
        { icon: <EditOutlined />, value: 'online', label: '上线' },
        { icon: <EllipsisOutlined />, value: 'online', label: '下线' }
      ]}
    >
      <GridItemRow label="入库时间">{dataSource.createdTime}</GridItemRow>
      <GridItemRow label="编辑时间">{dataSource.updatedTime}</GridItemRow>
      <GridItemRow label="ID:">
        <a onClick={e => onClick('id')}>{dataSource.id}</a>
      </GridItemRow>
      <GridItemRow label="供应商:">{dataSource.resId}</GridItemRow>
      <GridItemRow>
        <Space>
          <span>LAI</span>
          <span>9.0</span>
          <span>8.5</span>
          <span>风景</span>
        </Space>
      </GridItemRow>

      <GridItemRow>
        <div style={{ height: 32, fontWeight: 700 }}>{dataSource.title}</div>
      </GridItemRow>
      <Divider style={{ margin: '6px 0' }} />

      <GridItemRow>
        <Row style={{ paddingBottom: 6 }}>
          <Col flex="auto">
            <Space>
              <span>肖像权文件</span>
              <span>物权文件</span>
            </Space>
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Space>
              {copyrightOptions.map(o => (
                <a key={o.value} onClick={e => onChange('RR', o.value)}>
                  {o.label}
                </a>
              ))}
            </Space>
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow>
        <Row>
          <Col flex="auto">
            <Select size="small" defaultValue="lucy" style={{ width: 80 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Select size="small" defaultValue="lucy" style={{ width: 80 }}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow>
        <Input size="small" placeholder="备注" />
      </GridItemRow>
    </GridItem>
  );
}
