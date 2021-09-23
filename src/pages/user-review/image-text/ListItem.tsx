import React, { ReactElement, useState } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';
import IconFont from 'src/components/Iconfont';
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

type Props<T> = {
  dataSource: T;
  index: number;
  onClick: (index: number, field: IImageActionType) => void;
  onChange: <P extends keyof T>(index: number, field: P, value: T[P]) => void;
  selected: boolean;
};

function getIndexProps(qualityStatus: IOsiImageReview['qualityStatus']) {
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

function isLicenseActive(releases: IImage['releases'], value: string): boolean {
  if (!releases || releases.length === 0) {
    return false;
  }
  return !!releases.find(o => o.type + '' === value);
}

export default React.memo(function ListItem({
  dataSource,
  selected,
  index,
  onClick,
  onChange
}: Props<IImage>): ReactElement {
  const [sensitiveListTitle, showSensitiveDetails] = useSentiveKeywords(dataSource.sensitiveList); // TODO 待优化
  return (
    <GridItem
      cover={<img src={dataSource.urlSmall} />}
      indexProps={{ ...getIndexProps(dataSource.osiImageReview.qualityStatus), text: index + 1 + '' }}
      height={460}
      onClick={field => onClick(index, field)}
      selected={selected}
      actions={[
        {
          icon: <CheckOutlined />,
          value: 'resolve',
          label: '通过',
          disabled: dataSource.osiImageReview.callbackStatus === 2
        },
        {
          icon: <CloseOutlined />,
          value: 'reject',
          label: '不通过',
          disabled: dataSource.osiImageReview.callbackStatus === 2
        },
        { icon: <CalendarOutlined />, value: 'logs', label: '日志' }
      ]}
    >
      <GridItemRow>
        <Row>
          <Col title="入库时间" flex="auto">
            {dataSource.createdTime}
          </Col>
          <Col title="编辑时间" style={{ textAlign: 'right' }}>
            {dataSource.osiImageReview.qualityEditTime}
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow label={<IconFont type="icon-ic_image" />}>
        <a style={{ color: '#337ab7' }} onClick={e => onClick(index, 'id')}>
          {dataSource.id}
        </a>
        {dataSource.osiImageReview.priority === 2 && (
          <IconFont
            title="加急"
            type="icon-xing"
            style={{ fontSize: 18, position: 'relative', top: 1, marginLeft: 6 }}
          />
        )}
      </GridItemRow>
      <GridItemRow label={<IconFont type="icon-wode" />}>{dataSource.osiProviderName}</GridItemRow>
      <GridItemRow>
        <Space>
          <span>LAI</span>
          <span title="AI质量评分">{dataSource.aiQualityScore}</span>
          <span title="AI美学评分">{dataSource.aiBeautyScore}</span>
          <span>{dataSource.categoryNames}</span>
        </Space>
      </GridItemRow>

      <GridItemRow>
        <div
          title={dataSource.title}
          style={{ height: 36, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {dataSource.title}
        </div>
      </GridItemRow>
      <Divider style={{ margin: '6px 0' }} />

      <GridItemRow>
        <div style={{ paddingBottom: 6 }}>
          <Space style={{ paddingRight: 12, paddingTop: 6 }}>
            {licenseOptions
              .filter(o => o.value !== '3')
              .map(o => {
                const isActvie = isLicenseActive(dataSource.releases, o.value as string);
                return (
                  <a
                    key={o.value}
                    style={isActvie ? { color: '#e30e09', fontWeight: 700 } : { color: '#444444' }}
                    onClick={e => (isActvie ? onClick(index, 'releases') : null)}
                  >
                    {o.label}
                  </a>
                );
              })}
          </Space>
          <RadioText<IImage['licenseType']>
            options={licenseTypeOptions}
            value={dataSource.licenseType}
            onChange={value => onChange(index, 'licenseType', value as IImage['licenseType'])}
          />

          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <Select
              value={dataSource.qualityRank}
              placeholder="等级"
              onChange={value => {
                onChange(index, 'qualityRank', value);
              }}
            >
              {qualityOptions.map(o => (
                <Option value={o.value} key={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </GridItemRow>
      <GridItemRow>
        <Select
          value={dataSource.copyright}
          placeholder="授权"
          style={{ width: '100%' }}
          onChange={value => onChange(index, 'copyright', value)}
        >
          {copyrightOptions.map(o => (
            <Option value={o.value} key={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </GridItemRow>
      <GridItemRow>
        <Input
          placeholder="备注"
          value={dataSource.memo}
          onChange={e => {
            onChange(index, 'memo', e.target.value);
          }}
        />
      </GridItemRow>
      {dataSource.reasonTitle && (
        <GridItem.TopTag align="right" color="rgb(255, 85, 0)">
          {dataSource.reasonTitle}
        </GridItem.TopTag>
      )}

      {dataSource.sensitiveList.length > 0 && (
        <GridItem.TopTag align="left" color="#666" onClick={showSensitiveDetails}>
          {sensitiveListTitle as string}
        </GridItem.TopTag>
      )}
    </GridItem>
  );
});
