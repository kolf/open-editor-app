import React, { FC, memo, useState } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import options, {
  AIDetection,
  AssetFamily,
  BatchAssignMode,
  BatchAssignStatus,
  IfSensitveCheck,
  Priority
} from 'src/declarations/enums/query';
import commonService from 'src/services/commonService';
import SearchSelect from 'src/components/SearchSelect';
import 'src/styles/FormList.scss';
import { useRequest } from 'ahooks';

const { Option } = Select;

function filterOption(input, option) {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const FormList = (props: any) => {
  const [collapse, setCollapse] = useState(false);
  const { data: providerOptions } = useRequest(() => commonService.getOptions({ type: 'provider' }), {
    initialData: []
  });

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
        <Form.Item name="assignStatus" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="分配状态">
            {options.get(BatchAssignStatus).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="userList" className="form-list-item">
          <SearchSelect style={{ width: 160 }} placeholder="分配对象" type="editUser" mode="multiple" manual />
        </Form.Item>
        <Form.Item name="osiProviderId" className="form-list-item">
          <Select allowClear filterOption={filterOption} showSearch style={{ width: 160 }} placeholder="数据来源">
            {providerOptions.map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="assignMode" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="分配">
            {options.get(BatchAssignMode).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="优先级">
            {options.get(Priority).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ifSensitveCheck" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="敏感检测">
            {options.get(IfSensitveCheck).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="aiDetection" className="form-list-item">
          <Select allowClear style={{ width: 120 }} placeholder="AI分类">
            {options.get(AIDetection).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
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
    </div>
  );
};

export default memo(FormList);
