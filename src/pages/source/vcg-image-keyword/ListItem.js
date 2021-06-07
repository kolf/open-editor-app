import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Tag, Tooltip, Button, Table, Input } from 'antd';

import ItemRow from 'components/ItemRow';
import KeywordsTag from 'components/KeywordsTag';
import s from './ListItem.less';

const defaultThumb = require('../../../assets/default.jpg');

const defaultTime = '0000-00-00 00:00:00';

const imageActions = [
  {
    value: 'middleImage',
    label: '查看中图',
    icon: 'icon-middleImage',
  },
  {
    value: 'originImage',
    label: '查看原图',
    icon: 'icon-originImage',
  },
];

const statusMap = {
  1: {
    color: '#666',
    title: '未审核',
  },
  2: {
    color: '#666',
    title: '一审核通过，二审未审核',
  },
  3: {
    color: '#e30e09',
    title: '二审驳回',
  },
  4: {
    color: '#e30e09',
    title: '驳回再提交',
  },
  5: {
    color: '#09e35c',
    title: '二审通过',
  },
};

const getIndexStyle = keywordsAuditStatus => {
  return (
    statusMap[keywordsAuditStatus] || {
      color: '#666',
      title: '未编审',
    }
  );
};

const ListItem = ({ dataSource, index, selected, onClick }) => {
  return (
    <div className={`${s.root}${selected ? ` ${s.rootActive}` : ''}`}>
      <div className={s.picture} onClick={onClick.bind(this, 'image')}>
        <img
          title={dataSource.caption}
          src={dataSource.oss176 || defaultThumb}
          alt={dataSource.caption}
        />
      </div>
      <ItemRow label="上传时间">{dataSource.uploadTime || defaultTime}</ItemRow>
      <ItemRow>
        ID:
        <a className={s.gapLeft} onClick={onClick.bind(this, 'resId')}>
          {dataSource.resId}
        </a>
      </ItemRow>
      <ItemRow>
        <Input
          size="small"
          placeholder="组标题"
          defaultValue={dataSource.title}
          readOnly
        />
      </ItemRow>
      <ItemRow>
        <KeywordsTag
          value={dataSource.keywordsTag}
          placeholder="原始关键词"
          onClick={onClick.bind(this, 'keywordTag')}
        />
      </ItemRow>

      {dataSource.urgent === '2' && (
        <Tag color="#f50" className={s.urgent}>
          加急
        </Tag>
      )}
      {/(3|4)/.test(dataSource.keywordsAuditStatus) && (
        <Tag
          color="#f50"
          title={`驳回原因：${dataSource.customReason || '无'}`}
          className={s.rejectReasonRight}
        >
          {dataSource.customReason || '无'}
        </Tag>
      )}
    </div>
  );
};

export default withStyles(s)(ListItem);
