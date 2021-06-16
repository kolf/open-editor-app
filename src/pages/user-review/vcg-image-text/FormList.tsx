import React, { FC, memo, useState } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import options, {
  Priority,
  Quality,
  LicenseType,
  IfHaveRelease,
  QualityStatus,
  IfSensitveCheck,
  Exclusive
} from 'src/declarations/enums/query';

import 'src/styles/FormList.scss';

const { Option } = Select;
const { Search } = Input;

const qualityStatusOptions = options.get(QualityStatus);
const priorityOptions = options.get(Priority);
const qualityOptions = options.get(Quality);
const licenseTypeOptions = options.get(LicenseType);
const ifSensitveCheckOptions = options.get(IfSensitveCheck);
const ifHaveReleaseOptions = options.get(IfHaveRelease);
const exclusiveOptions = options.get(Exclusive);

const options1 = [
  {
    value: '1',
    label: '选项1'
  },
  {
    value: '2',
    label: '选项2'
  }
];

const levelOptions = Array.from({ length: 10 }, (item, index) => ({
  value: index + 1 + '',
  label: index + 1 + ''
}));

export const FormList = (props: any) => {
  const [collapse, setCollapse] = useState(false);
  return (
    <div className="formList-root">
      <Form
        layout="inline"
        onValuesChange={props.onChange}
        className="formList-list"
        style={{ height: collapse ? 'auto' : 38 }}
      >
        <Form.Item name="createdTime" className="form-list-item">
          <DatePicker placeholder="入库时间" />
        </Form.Item>
        <Form.Item name="qualityEditTime" className="form-list-item">
          <DatePicker placeholder="审核时间" />
        </Form.Item>
        <Form.Item name="qualityStatus" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="审核状态">
            {qualityStatusOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="osiProviderId" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="数据来源">
            {options1.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="aiQualityScore" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="AI质量评分">
            {levelOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="aiBeautyScore" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="AI美学评分">
            {levelOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="qualityRank" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="质量等级">
            {qualityOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="优先级">
            {priorityOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="licenseType" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="授权文件">
            {licenseTypeOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ifSensitveCheck" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="敏感词检测">
            {ifSensitveCheckOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="exclusive" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="独家性">
            {exclusiveOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ifHaveRelease" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="授权">
            {ifHaveReleaseOptions.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="category" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="AI分类">
            {options1.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div className="formList-dropdown">
        {collapse ? (
          <Button type="text" shape="circle" title="收缩" icon={<DownOutlined />} onClick={e => setCollapse(false)} />
        ) : (
          <Button type="text" shape="circle" title="展开" icon={<UpOutlined />} onClick={e => setCollapse(true)} />
        )}
      </div>
      <div className="formList-search">
        <Search
          allowClear
          placeholder="请输入关键词，多个用逗号隔开"
          enterButton="搜索"
          onSearch={value =>
            props.onChange({
              keyword: value
            })
          }
        />
      </div>
    </div>
  );
};

export default memo(FormList);
