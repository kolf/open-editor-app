import React, { ReactElement } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
import RadioText from 'src/components/RadioText';
import { useSentiveKeywords } from 'src/hooks/useSentiveKeywords';
import options, { Quality, LicenseType, CopyrightType, License } from 'src/declarations/enums/query';
const { Option } = Select;
const licenseTypeOptions = options.get(LicenseType);
const licenseOptions = options.get(License);
const qualityOptions = options.get(Quality);
const copyrightOptions = options.get(CopyrightType);

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
      title: `待编审`,
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

function isLicenseActive(license, copyright: any): boolean {
  return license === '1' ? ['1', '2', '4'].includes(copyright) : ['2', '3', '5'].includes(copyright);
}

export default function ListItem({ dataSource, selected, index, onClick, onChange }: Props): ReactElement {
  const [sensitiveListTitle, showSensitiveDetails] = useSentiveKeywords(dataSource.sensitiveList);
  return (
    <GridItem
      cover={<img src={dataSource.urlSmall} />}
      indexProps={{ ...getIndexProps(dataSource.qualityStatus), text: index + 1 }}
      height={440}
      onClick={onClick}
      selected={selected}
      actions={[
        { icon: <CheckOutlined />, value: 'resolve', label: '通过' },
        { icon: <CloseOutlined />, value: 'reject', label: '不通过' }
      ]}
    >
      <GridItemRow>
        <Row>
          <Col title="入库时间" flex="auto">
            {dataSource.createdTime}
          </Col>
          <Col title="编辑时间" style={{ textAlign: 'right' }}>
            {dataSource.updatedTime}
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow label="ID:">
        <a onClick={e => onClick('id')}>{dataSource.id}</a>
      </GridItemRow>
      <GridItemRow label="供应商:">{dataSource.osiProviderName}</GridItemRow>
      <GridItemRow>
        <Space>
          <span>LAI</span>
          <span title="AI美学评分">{dataSource.aiBeautyScore}</span>
          <span title="AI质量评分">{dataSource.aiQualityScore}</span>
          <span>{dataSource.categoryNames}</span>
        </Space>
      </GridItemRow>

      <GridItemRow>
        <div style={{ height: 32, fontWeight: 700 }}>{dataSource.title}</div>
      </GridItemRow>
      <Divider style={{ margin: '6px 0' }} />

      <GridItemRow>
        <Row style={{ paddingBottom: 6 }}>
          <Col flex="auto">
            <Space style={{ paddingRight: 24, paddingTop: 2 }}>
              {licenseOptions.map(o => {
                const isActvie = isLicenseActive(o.value, dataSource.copyright);
                return (
                  <a
                    key={o.value}
                    style={{ color: isActvie ? '' : '#666' }}
                    onClick={e => (isActvie ? onClick('license', o.value) : null)}
                  >
                    {o.label}
                  </a>
                );
              })}
            </Space>
            <RadioText
              options={licenseTypeOptions}
              value={dataSource.licenseType}
              onChange={value => onChange('licenseType', value)}
            />
          </Col>
          <Col>
            <Select
              size="small"
              value={dataSource.qualityRank}
              placeholder="等级"
              onChange={o => {
                onChange('qualityRank', o);
              }}
            >
              {qualityOptions.map(o => (
                <Option value={o.value} key={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow>
        <Select
          size="small"
          value={dataSource.copyright}
          placeholder="授权"
          style={{ width: '100%' }}
          onChange={value => onChange('copyright', value)}
        >
          {copyrightOptions.map(o => (
            <Option value={o.value} key={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </GridItemRow>
      <GridItemRow>
        <Input readOnly size="small" placeholder="备注" defaultValue={dataSource.memo} />
      </GridItemRow>
      {dataSource.reasonTitle && (
        <GridItem.TopTag align="right" color="rgb(255, 85, 0)">
          {dataSource.reasonTitle}
        </GridItem.TopTag>
      )}

      {dataSource.sensitiveList.length > 0 && (
        <GridItem.TopTag align="left" color="#333" onClick={showSensitiveDetails}>
          {sensitiveListTitle}
        </GridItem.TopTag>
      )}
    </GridItem>
  );
}
