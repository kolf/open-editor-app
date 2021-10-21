import React, { ReactElement } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';
import IconFont from 'src/components/Iconfont';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
import RadioText from 'src/components/RadioText';
import SensitiveWordsTips from 'src/components/SensitiveWordsTips';
import options, { Quality } from 'src/declarations/enums/query';
import { useIntl } from 'react-intl';
import { useOptions } from 'src/hooks/useSelect';
const { Option } = Select;
const qualityOptions = options.get(Quality);

type Props<T> = {
  dataSource: T;
  index: number;
  onClick: (index: number, field: IImageActionType) => void;
};

function isLicenseActive(releases: IImage['releases'], value: IImage['releaseType']): boolean {
  if (!releases || releases.length === 0) {
    return false;
  }
  return !!releases.find(o => o.type + '' === value);
}

export default React.memo(function ListItem({ dataSource, index, onClick }: Props<IImage>): ReactElement {
  const { formatMessage } = useIntl();
  const copyrightOptions = useOptions<IImage['copyright']>('image.copyright', ['0', '1', '2', '3', '7', '9']);
  const licenseTypeOptions = useOptions<IImage['licenseType']>('image.liceseType', ['1', '2']);
  const licenseOptions = useOptions<IImage['releaseType']>('image.releaseType.s', ['1', '2']);

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
      actions={[{ icon: <CalendarOutlined />, value: 'logs', label: formatMessage({ id: 'image.log' }) }]}
    >
      <GridItemRow>
        <Row>
          <Col title={formatMessage({ id: 'image.createdTime' })} flex="auto">
            {dataSource.createdTime}
          </Col>
          <Col title={formatMessage({ id: 'image.qualityEditTime' })} style={{ textAlign: 'right' }}>
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
            title={formatMessage({ id: 'image.priority.2' })}
            type="icon-xing"
            style={{ fontSize: 18, position: 'relative', top: 1, marginLeft: 6 }}
          />
        )}
      </GridItemRow>
      <GridItemRow label={<IconFont type="icon-wode" />}>{dataSource.osiProviderName}</GridItemRow>
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
          style={{ height: 36, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}
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
          <RadioText<IImage['licenseType']> options={licenseTypeOptions} value={dataSource.licenseType} />

          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <Select defaultValue={dataSource.qualityRank} placeholder={formatMessage({ id: 'image.qualityRank' })}>
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
          defaultValue={dataSource.copyright}
          placeholder={formatMessage({ id: 'image.copyright' })}
          style={{ width: '100%' }}
        >
          {copyrightOptions.map(o => (
            <Option value={o.value} key={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </GridItemRow>
      <GridItemRow>
        <Input readOnly placeholder={formatMessage({ id: 'image.memo' })} defaultValue={dataSource.memo} />
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
