import React, { ReactElement, useState } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import IconFont from 'src/components/Iconfont';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
import RadioText from 'src/components/RadioText';
import SensitiveWordsTips from 'src/components/SensitiveWordsTips';
import options, { Quality } from 'src/declarations/enums/query';
import { useIntl } from 'react-intl';
import { useOptions } from 'src/hooks/useSelect';
import { createTextCopyAndSelection } from 'src/utils/dom';

const { Option } = Select;
const qualityOptions = options.get(Quality);

type Props<T> = {
  dataSource: T;
  index: number;
  onClick: (index: number, field: IImageActionType) => void;
  onChange: <P extends keyof T>(index: number, field: P, value: T[P]) => void;
  selected: boolean;
};

function isLicenseActive(releases: IImage['releases'], value: IImage['releaseType']): boolean {
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
  const { formatMessage } = useIntl();
  const copyrightOptions = useOptions<IImage['copyright']>('image.copyright', ['0', '1', '2', '3', '7', '9']);
  const licenseTypeOptions = useOptions<IImage['licenseType']>('image.liceseType', ['1', '2']);
  const licenseOptions = useOptions<IImage['releaseType']>('image.releaseType.s', ['1', '2']);
  const disabledMessage =
    dataSource.osiImageReview.callbackStatus === 2 ? formatMessage({ id: 'image.callbackStatus.2' }) : '';

  // TODO 待优化
  const indexPropsMap = {
    14: {
      title: formatMessage({ id: 'image.status.14' }),
      color: '#666666'
    },
    24: {
      title: formatMessage({ id: 'image.status.24' }),
      color: '#09e35c'
    },
    34: {
      title: formatMessage({ id: 'image.status.34' }),
      color: '#e30e09'
    }
  };

  return (
    <GridItem
      cover={<img src={dataSource.urlSmall} />}
      indexProps={{ ...indexPropsMap[dataSource.osiImageReview.qualityStatus], text: index + 1 + '' }}
      height={460}
      onClick={field => onClick(index, field)}
      selected={selected}
      actions={[
        {
          icon: <CheckOutlined />,
          value: 'resolve',
          label: formatMessage({ id: 'image.action.setResolve' }),
          disabledMessage
        },
        {
          icon: <CloseOutlined />,
          value: 'reject',
          label: formatMessage({ id: 'image.action.setReject' }),
          disabledMessage
        },
        { icon: <CalendarOutlined />, value: 'logs', label: formatMessage({ id: 'image.log' }) }
      ]}
    >
      <GridItemRow>
        <Row>
          <Col title={formatMessage({ id: 'image.createdTime' })} flex="auto" style={{ letterSpacing: -1 }}>
            {dataSource.createdTime}
          </Col>
          <Col title={formatMessage({ id: 'image.qualityEditTime' })} style={{ textAlign: 'right', letterSpacing: -1 }}>
            {dataSource.osiImageReview.qualityEditTime}
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow label={<IconFont type="icon-ic_image" />}>
        <a style={{ color: '#337ab7' }} onClick={e => onClick(index, 'id')}>
          {dataSource.id}
        </a>
        <a>（<span onClick={createTextCopyAndSelection}>{dataSource.providerResId}</span>）</a>
        {dataSource.osiImageReview.priority === 2 && (
          <IconFont
            title={formatMessage({ id: 'image.priority.2' })}
            type="icon-xing"
            style={{ fontSize: 18, position: 'relative', top: 1, marginLeft: 6 }}
          />
        )}
      </GridItemRow>
      <GridItemRow
        label={<IconFont type="icon-wode" />}
        childrenStyle={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        childrenTitle={dataSource.osiProviderName}
      >
        {dataSource.osiProviderName}
      </GridItemRow>
      <GridItemRow>
        <Space>
          <span>LAI</span>
          <span title={formatMessage({ id: 'image.aiQualityScore' })}>{dataSource.aiQualityScore}</span>
          <span title={formatMessage({ id: 'image.aiBeautyScore' })}>{dataSource.aiBeautyScore}</span>
          <span>{dataSource.categoryNames}</span>
        </Space>
      </GridItemRow>

      <GridItemRow>
        <div
          title={dataSource.title}
          style={{ height: 36, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-all' }}
        >
          {dataSource.title}
        </div>
      </GridItemRow>
      <Divider style={{ margin: '6px 0' }} />

      <GridItemRow>
        <div style={{ paddingBottom: 6 }}>
          <Space style={{ paddingRight: 12, paddingTop: 6 }}>
            {licenseOptions.map(o => {
              const isActvie = isLicenseActive(dataSource.releases, o.value);
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
            onChange={value => onChange(index, 'licenseType', value)}
          />

          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <Select
              value={dataSource.qualityRank}
              placeholder={formatMessage({ id: 'image.qualityRank' })}
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
          placeholder={formatMessage({ id: 'image.copyright' })}
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
          placeholder={formatMessage({ id: 'image.memo' })}
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

      <SensitiveWordsTips dataSource={dataSource.sensitiveWordList} />
    </GridItem>
  );
});
