import React, { useState } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import { Form, Input, Select, Button } from 'antd';
const { Option } = Select;
const s = {
  root: {
    marginBottom: 12,
  },
};

export default function FormList() {


  return (
    <div className={s.root}>
      <Form layout="inline">
        <Form.Item name="price">
          <Input placeholder="入库时间" />
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="审核时间" />
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="审核状态" />
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="数据来源" />
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="AI质量评分" />
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="AI美学评分" />
        </Form.Item>
        <Form.Item name="price">
          <Input placeholder="质量等级" />
        </Form.Item>
      </Form>
    </div>
  );
}

