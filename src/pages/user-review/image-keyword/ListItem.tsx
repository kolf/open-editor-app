import React, { ReactElement, useState } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import IconFont from 'src/components/Iconfont';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
import KeywordTextAreaGroup, { ModeType as KeywordModeType } from 'src/components/KeywordTextAreaGroup';
import SensitiveWordsTips from 'src/components/SensitiveWordsTips';
import { useIntl } from 'react-intl';
import { createTextCopyAndSelection } from 'src/utils/dom';

type Props<T> = {
  dataSource: T;
  index: number;
  onClick: (index: number, field: IImageActionType) => void;
  onChange: <P extends keyof T>(index: number, field: P, value: T[P]) => void;
  selected: boolean;
  keywordMode: KeywordModeType;
};

function getHeight(keywordMode: KeywordModeType): number {
  if (keywordMode === 'kind') {
    return 890;
  }
  if (keywordMode === 'source') {
    return 804;
  }
  return 572;
}

export default React.memo(function ListItem({
  dataSource,
  selected,
  keywordMode,
  index,
  onClick,
  onChange
}: Props<IImage>): ReactElement {
  const { formatMessage } = useIntl();
  const disabledMessage =
    dataSource.osiImageReview.keywordsCallbackStatus === 2 ? formatMessage({ id: 'image.callbackStatus.2' }) : '';

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
      indexProps={{ ...indexPropsMap[dataSource.osiImageReview.keywordsStatus], text: index + 1 + '' }}
      height={getHeight(keywordMode)}
      onClick={field => onClick(index, field)}
      selected={selected}
      actions={[
        {
          icon: <CheckOutlined />,
          value: 'resolve',
          label: formatMessage({ id: 'image.action.setResolve' }),
          disabledMessage
        },
        { icon: <CalendarOutlined />, value: 'logs', label: formatMessage({ id: 'image.log' }) }
      ]}
    >
      <GridItemRow>
        <Row style={{justifyContent: 'space-between'}}>
          <Col title={formatMessage({ id: 'image.createdTime' })} flex="auto" style={{letterSpacing: -1}}>
            {dataSource.createdTime}
          </Col>
          <Col title={formatMessage({ id: 'image.qualityEditTime' })} style={{ textAlign: 'right', letterSpacing: -1 }}>
            {dataSource.osiImageReview.keywordsEditTime}
          </Col>
        </Row>
      </GridItemRow>
      <GridItemRow label={<IconFont type="icon-ic_image" />}>
        <a style={{ color: '#337ab7' }} onClick={e => onClick(index, 'id')}>
          {dataSource.id}
        </a>
        <a title='原始id'>（<span onClick={createTextCopyAndSelection}>{dataSource.providerResId}</span>）</a>
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
        <Input.TextArea
          title={dataSource.title}
          rows={2}
          value={dataSource.title}
          placeholder={formatMessage({ id: 'image.title' })}
          onChange={e => onChange(index, 'title', e.target.value)}
        />
      </GridItemRow>
      <Divider style={{ margin: '6px 0' }} />

      <GridItemRow>
        <KeywordTextAreaGroup
          langType={dataSource.osiKeywodsData?.langType}
          mode={keywordMode}
          value={dataSource.keywordTags}
          onChange={value => {
            onChange(index, 'keywordTags', value);
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
