import React, { ReactElement } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
import RadioText from 'src/components/RadioText';
import options, { Quality, LicenseType, CopyrightType } from 'src/declarations/enums/query';
const { Option } = Select;
const licenseTypeOptions = options.get(LicenseType);
const qualityOptions = options.get(Quality);
const copyrightTypeOptions = options.get(CopyrightType);

interface Props {
  dataSource: any;
  index: number;
  onClick: any;
  onChange: any;
  selected: boolean;
}

function getIndexProps(qualityStatus) {
  if (/^1/.test(qualityStatus)) {
    return {
      title: `未编审`,
      color: '#666666'
    };
  }
  if (/^2/.test(qualityStatus)) {
    return {
      title: `已通过`,
      color: '#09e35c'
    };
  }
  if (/^3/.test(qualityStatus)) {
    return {
      title: `不通过`,
      color: '#e30e09'
    };
  }
}

export default function ListItem({ dataSource, selected, index, onClick, onChange }: Props): ReactElement {
  return (
    <GridItem
      cover={<img src={dataSource.urlSmall} />}
      indexProps={{ ...getIndexProps(dataSource.qualityStatus), text: index + 1 }}
      height={432}
      onClick={onClick}
      selected={selected}
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
            <RadioText options={licenseTypeOptions} value={dataSource.licenseType} />
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow>
        <Row>
          <Col flex="auto">
            <Select size="small" value={dataSource.qualityRank} placeholder="等级">
              {qualityOptions.map(o => (
                <Option value={o.value} key={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col style={{ maxWidth: 120 }}>
            <Select size="small" value={dataSource.copyright} placeholder="授权" style={{ width: '100%' }}>
              {copyrightTypeOptions.map(o => (
                <Option value={o.value} key={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow>
        <Input readOnly size="small" placeholder="备注" defaultValue={dataSource.memo} />
      </GridItemRow>
    </GridItem>
  );
}