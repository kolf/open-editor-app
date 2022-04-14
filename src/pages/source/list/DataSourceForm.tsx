import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Radio } from 'antd';
import {
  AIDetection,
  AIService,
  AssetType,
  AssignType,
  AuditType,
  BatchGeneratedRules,
  BatchGeneratedRulesDesMap,
  KeywordAIService,
  KeywordAuditDefault,
  KeywordSensitiveCheckType,
  QualitySensitiveCheckType,
  SensitiveCheckType,
  SensitiveWordList
} from 'src/declarations/enums/query';
import { ModalType } from '.';
import { FormattedMessage, useIntl } from 'react-intl';
import { zhCNMap } from 'src/locales/zhCN';
import { QuestionCircleOutlined } from '@ant-design/icons';

const defaultOptions: any = {
  sensitiveCheckType: SensitiveCheckType,
  AIDetection: AIService,
  titleAuditDefault: KeywordAuditDefault,
  keywordAuditDefault: KeywordAuditDefault
};
export default function CreateDataModal({
  saveRef,
  initialValues = {
    assetType: AssetType.图片,
    assignType: AssignType.人工
  },
  modalType
}: {
  saveRef: any;
  initialValues: any;
  modalType: ModalType;
}) {
  const intl = useIntl();

  const [opts, setOptions] = useState(defaultOptions);
  const [form] = Form.useForm(null);
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    // 如果弹窗为修改数据来源 且 审核类型只勾选质量审核、关键词审核其中一个
    if (modalType === ModalType.修改数据来源 && initialValues?.auditFlows?.length === 1) {
      if (initialValues?.auditFlows?.includes(AuditType.质量审核)) {
        setOptions({
          sensitiveCheckType: QualitySensitiveCheckType,
          AIDetection: AIDetection
        });
      } else if (initialValues?.auditFlows?.includes(AuditType.关键词审核)) {
        setOptions({
          sensitiveCheckType: KeywordSensitiveCheckType,
          AIDetection: KeywordAIService,
          titleAuditDefault: KeywordAuditDefault,
          keywordAuditDefault: KeywordAuditDefault
        });
      }
    }
  }, []);

  // 审核类型不同导致的选项不同
  const onFieldsChange = v => {
    v = v[0];
    if (!v.name.includes('auditFlows')) return;

    const auditTypeMap = {
      [AuditType.质量审核]: {
        sensitiveCheckType: QualitySensitiveCheckType,
        AIDetection: AIDetection
      },
      [AuditType.关键词审核]: {
        sensitiveCheckType: KeywordSensitiveCheckType,
        AIDetection: KeywordAIService,
        titleAuditDefault: KeywordAuditDefault,
        keywordAuditDefault: KeywordAuditDefault
      }
    };

    let optionsMap;
    if (!v.value.length) {
      optionsMap = defaultOptions;
    } else {
      optionsMap = v.value
        .sort()
        .map(item => auditTypeMap[item])
        .reduce((memo, item) => {
          Object.keys(item).forEach(name => {
            if (!memo[name]) {
              memo[name] = item[name];
            } else {
              memo[name] = Object.assign({}, memo[name], item[name]);
            }
          });
          return memo;
        }, {});
    }

    setOptions(optionsMap);
  };

  useEffect(() => {
    saveRef(form);
  }, [form]);

  return (
    <>
      <Form
        form={form}
        onFieldsChange={onFieldsChange}
        onValuesChange={newValue => setValues({ ...values, ...newValue })}
        initialValues={initialValues}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item
          label={<FormattedMessage id="Title" />}
          name="name"
          rules={[{ required: true, message: <FormattedMessage id="Please Enter Title!" /> }]}
        >
          <Input
            title={intl.formatMessage({ id: 'Please enter the data source name, no more than 200 characters' })}
            placeholder={intl.formatMessage({ id: 'Please enter the data source name, no more than 200 characters' })}
          />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="Resource Type" />}
          name="assetType"
          rules={[{ required: true, message: intl.formatMessage({ id: 'select.placeholder' }) }]}
        >
          <Radio.Group>
            {Object.keys(AssetType).map((t, i) => (
              <Radio key={`${t}${i}`} value={AssetType[t]} disabled={AssetType[t] !== AssetType.图片}>
                <FormattedMessage id={zhCNMap[t]} />
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="Inspection Type" />}
          name="auditFlows"
          rules={[{ required: true, message: intl.formatMessage({ id: 'select.placeholder' }) }]}
        >
          <Checkbox.Group>
            {Object.keys(AuditType).map((t, i) => {
              return (
                <Checkbox key={`${t}${i}`} value={AuditType[t]}>
                  <FormattedMessage id={zhCNMap[t]} />
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="Distribution" />}
          name="assignType"
          rules={[{ required: true, message: intl.formatMessage({ id: 'select.placeholder' }) }]}
        >
          <Radio.Group>
            {Object.keys(AssignType).map((t, i) => (
              <Radio value={AssignType[t]} key={`${t}${i}`} disabled={AssignType[t] !== AssignType.人工}>
                {AssignType[t] === AssignType.系统 ? (
                  <div>
                    <FormattedMessage id={zhCNMap[t]} />
                    （<FormattedMessage id="All Resources" />）
                  </div>
                ) : (
                  <FormattedMessage id={zhCNMap[t]} />
                )}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="Batch Rules" />}
          name="batchOverType"
          rules={[{ required: true, message: intl.formatMessage({ id: 'select.placeholder' }) }]}
          tooltip={{
            title: (
              <div>
                {Object.keys(BatchGeneratedRules).map((t, i) => {
                  return (
                    <div>
                      {intl.formatMessage({ id: zhCNMap[t] })}:
                      {intl.formatMessage({ id: BatchGeneratedRulesDesMap[BatchGeneratedRules[t]] })}
                    </div>
                  );
                })}
              </div>
            ),
            overlayStyle: {maxWidth: 400},
            icon: <QuestionCircleOutlined />
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Radio.Group>
              {Object.keys(BatchGeneratedRules).map((t, i) => {
                return (
                  <Radio value={BatchGeneratedRules[t]} key={`${t}${i}`}>
                    <FormattedMessage id={zhCNMap[t]} />
                  </Radio>
                );
              })}
            </Radio.Group>
            {/* <FormattedMessage id={BatchGeneratedRulesDesMap[BatchGeneratedRules[t]]} /> */}
          </div>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="NSFW Scan" />}
          name="sensitiveCheckType"
          rules={[
            {
              required: values.sensitiveKeywordsTable?.length > 0,
              message: intl.formatMessage({ id: 'select.placeholder' })
            }
          ]}
        >
          <Checkbox.Group>
            {Object.keys(opts.sensitiveCheckType).map((t, i) => (
              <Checkbox key={`${t}${i}`} value={opts.sensitiveCheckType[t]}>
                <FormattedMessage id={zhCNMap[t]} />
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="NSFW Keywords" />}
          name="sensitiveKeywordsTable"
          rules={[
            {
              required: values.sensitiveCheckType?.length > 0,
              message: <FormattedMessage id="Please Select NSFW Keywords!" />
            }
          ]}
        >
          <Checkbox.Group>
            {Object.keys(SensitiveWordList).map((t, i) => (
              <Checkbox key={`${t}${i}`} value={SensitiveWordList[t]}>
                <FormattedMessage id={zhCNMap[t]} />
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label={<FormattedMessage id="AI" />} name="AIDetection">
          <Checkbox.Group>
            {Object.keys(opts.AIDetection).map((t, i) => {
              return (
                <Checkbox key={`${t}${i}`} value={opts.AIDetection[t]}>
                  <FormattedMessage id={zhCNMap[t]} />
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
        {opts?.titleAuditDefault && (
          <Form.Item
            label={<FormattedMessage id="Title Reivew Default Data" />}
            name="keywordsReivewTitle"
            rules={[{ required: true, message: <FormattedMessage id="Please Select Title Reivew Default Data" /> }]}
          >
            <Checkbox.Group>
              {Object.keys(opts.titleAuditDefault).map((t, i) => {
                return (
                  <Checkbox key={`${t}${i}`} value={opts.titleAuditDefault[t]}>
                    <FormattedMessage id={zhCNMap[t]} />
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
        )}
        {opts?.keywordAuditDefault && (
          <Form.Item
            label={<FormattedMessage id="Keywords Review Default Data" />}
            name="keywordsReviewKeywords"
            rules={[{ required: true, message: <FormattedMessage id="Please Select Keywords Review Default Data" /> }]}
          >
            <Checkbox.Group>
              {Object.keys(opts.keywordAuditDefault).map((t, i) => {
                return (
                  <Checkbox key={`${t}${i}`} value={opts.keywordAuditDefault[t]}>
                    <FormattedMessage id={zhCNMap[t]} />
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
        )}
      </Form>
    </>
  );
}
