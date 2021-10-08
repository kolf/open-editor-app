import React, { useState, useContext } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SearchSelect from 'src/components/SearchSelect';
import InputSplit from 'src/components/InputSplit';
import { DataContext } from 'src/components/contexts/DataProvider';
import options, {
  Priority,
  Quality,
  License,
  LicenseType,
  QualityStatus,
  IfSensitiveCheck
} from 'src/declarations/enums/query';
import 'src/styles/FormList.less';
interface Props {
  initialValues: any;
  onChange: (value: any) => void;
}

const { Option } = Select;
const { RangePicker } = DatePicker;
const qualityStatusOptions = options.get(QualityStatus);
const priorityOptions = options.get(Priority);
const qualityOptions = options.get(Quality);
const licenseOptions = options.get(License);
const ifSensitveCheckOptions = options.get(IfSensitiveCheck);
const LicenseTypeOptions = options.get(LicenseType);

function filterOption(input, option) {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export default React.memo(function FormList({ initialValues, onChange }: Props) {
  const [form] = Form.useForm(null);
  const [collapse, setCollapse] = useState(false);
  const { providerOptions, categoryOptions } = useContext(DataContext);
  const values = form.getFieldsValue();

  return (
    <div className="formList-root">
      <div className="formList-list" style={{ height: collapse ? 'auto' : 38 }}>
        <Form form={form} layout="inline" initialValues={initialValues} onValuesChange={onChange}>
          <Form.Item name="createdTime" className="form-list-item">
            <RangePicker
              inputReadOnly
              style={{ width: 190 }}
              separator={values.createdTime ? '~' : ''}
              placeholder={['入库时间', '']}
            />
          </Form.Item>
          <Form.Item name="qualityEditTime" className="form-list-item">
            <RangePicker
              style={{ width: 190 }}
              separator={values.qualityEditTime ? '~' : ''}
              placeholder={['审核时间', '']}
            />
          </Form.Item>
          <Form.Item name="qualityStatus" className="form-list-item">
            <Select allowClear filterOption={filterOption} showSearch style={{ width: 100 }} placeholder="审核状态">
              {qualityStatusOptions.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="osiProviderId" className="form-list-item">
            <SearchSelect
              type="provider"
              manual
              options={providerOptions}
              style={{ width: 160 }}
              placeholder="数据来源"
            />
          </Form.Item>
          <Form.Item name="aiQualityScore" className="form-list-item">
            <InputSplit placeholder="AI质量评分" />
          </Form.Item>
          <Form.Item name="aiBeautyScore" className="form-list-item">
            <InputSplit placeholder="AI美学评分" />
          </Form.Item>
          <Form.Item name="qualityRank" className="form-list-item">
            <Select allowClear filterOption={filterOption} showSearch style={{ width: 100 }} placeholder="质量等级">
              {qualityOptions.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority" className="form-list-item">
            <Select allowClear filterOption={filterOption} showSearch style={{ width: 100 }} placeholder="优先级">
              {priorityOptions.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="license" className="form-list-item">
            <Select allowClear filterOption={filterOption} showSearch style={{ width: 100 }} placeholder="授权文件">
              {licenseOptions.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="haveSensitve" className="form-list-item">
            <Select allowClear filterOption={filterOption} showSearch style={{ width: 120 }} placeholder="敏感词">
              {ifSensitveCheckOptions.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="licenseType" className="form-list-item">
            <Select allowClear filterOption={filterOption} showSearch style={{ width: 100 }} placeholder="授权">
              {LicenseTypeOptions.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="category" className="form-list-item">
            <SearchSelect
              style={{ width: 120 }}
              manual
              options={categoryOptions}
              placeholder="AI分类"
              type="category"
            />
          </Form.Item>
        </Form>
      </div>
      <div className="formList-dropdown">
        {collapse ? (
          <Button type="text" shape="circle" title="收缩" icon={<UpOutlined />} onClick={e => setCollapse(false)} />
        ) : (
          <Button type="text" shape="circle" title="展开" icon={<DownOutlined />} onClick={e => setCollapse(true)} />
        )}
      </div>
    </div>
  );
});
