import React, { FC, memo, useState } from 'react';
import { Form, Select, DatePicker, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import options, {
  AIDetection,
  AIService,
  BatchAssignMode,
  BatchAssignStatus,
  IfSensitiveCheckBool,
  Priority,
  SensitiveCheckType,
  SensitiveWordList
} from 'src/declarations/enums/query';
import SearchSelect from 'src/components/SearchSelect';
import 'src/styles/FormList.less';
import { useContext } from 'react';
import { DataContext } from 'src/components/contexts/DataProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import { zhCNMap } from 'src/locales/zhCN';

const { Option } = Select;

const FormList = (props: any) => {
  const [collapse, setCollapse] = useState(false);
  const intl = useIntl();

  const { providerOptions } = useContext(DataContext);
  return (
    <div className="formList-root">
      <Form
        layout="inline"
        onValuesChange={props.onChange}
        className="formList-list"
        style={{ height: collapse ? 'auto' : 38 }}
        initialValues={{
          assignStatus: props.assignStatus
        }}
      >
        <Form.Item name="createdTime" className="form-list-item">
          {/* 入库时间 */}
          <DatePicker.RangePicker
            style={{ width: 250 }}
            separator={props.createdTime ? '~' : ''}
            placeholder={[intl.formatMessage({ id: 'Submission Date' }), '']}
          />
        </Form.Item>
        <Form.Item name="assignStatus" className="form-list-item">
          {/* 分配状态 */}
          <Select allowClear style={{ width: 150 }} placeholder={<FormattedMessage id="Distribution Stats" />}>
            {options.get(BatchAssignStatus).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                <FormattedMessage id={zhCNMap[o.label]} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="userList" className="form-list-item">
          {/* 分配对象 */}
          <SearchSelect
            style={{ width: 160 }}
            placeholder={<FormattedMessage id="Editors" />}
            type="editUser"
            mode="multiple"
            manual
            fixedOptions={[{ value: '-1', label: <FormattedMessage id="All Resources" /> }]}
          />
        </Form.Item>
        <Form.Item name="osiProviderId" className="form-list-item">
          {/* 数据来源 */}
          <SearchSelect
            allowClear
            showSearch
            type="provider"
            style={{ width: 160 }}
            placeholder={<FormattedMessage id="Data Source" />}
            options={providerOptions}
            manual
          />
        </Form.Item>
        <Form.Item name="assignMode" className="form-list-item">
          {/* 分配 */}
          <Select allowClear style={{ width: 120 }} placeholder={<FormattedMessage id="Distribution" />}>
            {options.get(BatchAssignMode).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                <FormattedMessage id={zhCNMap[o.label]} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="sensitiveCheckType" className="form-list-item">
          {/* 敏感检测 */}
          <Select allowClear style={{ width: 120 }} placeholder={<FormattedMessage id="NSFW Scan" />}>
            {options.get(SensitiveCheckType).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                <FormattedMessage id={zhCNMap[o.label]} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority" className="form-list-item">
          {/* 优先级 */}
          <Select allowClear style={{ width: 120 }} placeholder={<FormattedMessage id="Priority" />}>
            {options.get(Priority).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                <FormattedMessage id={zhCNMap[o.label]} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="sensitiveKeywordsTable" className="form-list-item">
          {/* 敏感词表 */}
          <Select allowClear style={{ width: 120 }} placeholder={<FormattedMessage id="NSFW Keywords" />}>
            {options.get(SensitiveWordList).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                <FormattedMessage id={zhCNMap[o.label]} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="aiDetection" className="form-list-item">
          <Select allowClear style={{ width: 140 }} placeholder={<FormattedMessage id="AI" />}>
            {options.get(AIService).map(o => (
              <Option key={`${o.label}${o.value}`} value={o.value}>
                <FormattedMessage id={zhCNMap[o.label]} />
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div className="formList-dropdown">
        {collapse ? (
          <Button type="text" shape="circle" title="收缩" icon={<UpOutlined />} onClick={e => setCollapse(false)} />
        ) : (
          <Button type="text" shape="circle" title="展开" icon={<DownOutlined />} onClick={e => setCollapse(true)} />
        )}
      </div>
    </div>
  );
};

export default memo(FormList);
