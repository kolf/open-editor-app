import React, { ReactElement, useState } from 'react';
import { Select, Input, Space, Divider, Row, Col } from 'antd';
import { CheckOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import IconFont from 'src/components/Iconfont';
import GridItem from 'src/components/list/GridItem';
import GridItemRow from 'src/components/list/GridItemRow';
import KeywordTextAreaGroup, { ModeType as KeywordModeType } from 'src/components/KeywordTextAreaGroup';

import { useSentiveKeywords } from 'src/hooks/useSentiveKeywords';

type Props<T> = {
  dataSource: T;
  index: number;
  onClick: (index: number, field: IImageActionType) => void;
  onChange: <P extends keyof T>(index: number, field: P, value: T[P]) => void;
  selected: boolean;
  keywordMode: KeywordModeType;
};

function getIndexProps(keywordsStatus: IOsiImageReview['keywordsStatus']) {
  if (/^1/.test(keywordsStatus)) {
    return {
      title: `待编审`,
      color: '#666666'
    };
  }
  if (/^2/.test(keywordsStatus)) {
    return {
      title: `已通过`,
      color: '#09e35c'
    };
  }
  if (/^3/.test(keywordsStatus)) {
    return {
      title: `不通过`,
      color: '#e30e09'
    };
  }
}

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
  const [sensitiveListTitle, showSensitiveDetails] = useSentiveKeywords(dataSource.sensitiveList); // TODO 待优化

  return (
    <GridItem
      cover={<img src={dataSource.urlSmall} />}
      indexProps={{ ...getIndexProps(dataSource.osiImageReview.keywordsStatus), text: index + 1 + '' }}
      height={getHeight(keywordMode)}
      onClick={field => onClick(index, field)}
      selected={selected}
      actions={[
        {
          icon: <CheckOutlined />,
          value: 'resolve',
          label: '通过',
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
      <GridItemRow label={<IconFont type="icon-wode" />}>{dataSource.osiProviderName as string}</GridItemRow>
      <GridItemRow>
        <Space>
          <span>LAI</span>
          <span title="AI质量评分">{dataSource.aiQualityScore}</span>
          <span title="AI美学评分">{dataSource.aiBeautyScore}</span>
          <span>{dataSource.categoryNames}</span>
        </Space>
      </GridItemRow>

      <GridItemRow>
        <Input.TextArea
          title={dataSource.title}
          rows={2}
          value={dataSource.title}
          placeholder="标题"
          onChange={e => onChange(index, 'title', e.target.value)}
        />
      </GridItemRow>
      <Divider style={{ margin: '6px 0' }} />

      <GridItemRow>
        <KeywordTextAreaGroup
          langType={dataSource.osiKeywodsData.langType}
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

      {dataSource.sensitiveList.length > 0 && (
        <GridItem.TopTag align="left" color="#666" onClick={showSensitiveDetails}>
          {sensitiveListTitle as string}
        </GridItem.TopTag>
      )}
    </GridItem>
  );
});
