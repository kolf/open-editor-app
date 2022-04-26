import React, { useEffect, useMemo, useState } from 'react';
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
  keywordsReviewKeywords,
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
  sensitiveCheckType: QualitySensitiveCheckType
  // AIDetection: AIService,
  // keywordsReivewTitle: keywordsReviewKeywords,
  // keywordsReviewKeywords: keywordsReviewKeywords
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

  const auditTypeMap = useMemo(() => {
    return {
      [AuditType.质量审核]: {
        sensitiveCheckType: QualitySensitiveCheckType,
        AIDetection: AIDetection
      },
      [AuditType.关键词审核]: {
        sensitiveCheckType: KeywordSensitiveCheckType,
        AIDetection: KeywordAIService,
        keywordsReivewTitle: keywordsReviewKeywords,
        keywordsReviewKeywords: keywordsReviewKeywords
      }
    };
  }, []);

  useEffect(() => {
    // 弹窗选项初始化
    setOptions(getOpts(values.auditFlows));
  }, []);

  // 获取对应审核类型的选项
  const getOpts = (auditFlows: string[]) => {
    if (!auditFlows || auditFlows.length === 0) {
      return opts;
    }
    return auditFlows
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
  };

  // 审核类型不同导致的选项不同
  const onFieldsChange = v => {
    v = v[0];
    if (!v?.name?.includes('auditFlows')) return;

    let optionsMap;
    if (!v.value.length) {
      optionsMap = defaultOptions;
    } else {
      optionsMap = getOpts(v.value);
    }
    setOptions(optionsMap);
  };

  const onValuesChange = newValue => {
    if (newValue?.auditFlows?.length === 1) {
      // AI检测，敏感词检测，标题审核初始化数据，关键词审核初始化数据，需要根据审核类型过滤数据
      ['AIDetection', 'sensitiveCheckType', 'keywordsReivewTitle', 'keywordsReviewKeywords'].forEach(key => {
        newValue[key] =
          values?.[key]?.filter(v => Object.values(auditTypeMap[newValue.auditFlows]?.[key] || {}).includes(v)) || [];
      });
    }

    // 标题审核初始化数据、关键词审核初始化数据与AI检测的关联关系
    if (
      newValue?.keywordsReivewTitle?.includes(keywordsReviewKeywords.AI) ||
      newValue?.keywordsReviewKeywords?.includes(keywordsReviewKeywords.AI)
    ) {
      newValue.AIDetection = [...new Set([...(values.AIDetection || []), KeywordAIService['AI自动标题/关键词']])];
    }
    if (newValue?.AIDetection && !newValue?.AIDetection?.includes(KeywordAIService['AI自动标题/关键词'])) {
      newValue.keywordsReivewTitle = values?.keywordsReivewTitle?.filter(v => v !== keywordsReviewKeywords.AI);
      newValue.keywordsReviewKeywords = values?.keywordsReviewKeywords?.filter(v => v !== keywordsReviewKeywords.AI);
    }

    // 敏感检测与敏感词表的关联关系
    if (newValue?.sensitiveCheckType && !newValue?.sensitiveCheckType?.length) {
      newValue.sensitiveKeywordsTable = [];
    }
    if (newValue?.sensitiveKeywordsTable && !newValue?.sensitiveKeywordsTable?.length) {
      newValue.sensitiveCheckType = [];
    }

    const nextValues = { ...values, ...newValue };

    setValues(nextValues);
    form.setFieldsValue(nextValues);
  };

  useEffect(() => {
    saveRef(form);
  }, [form]);

  return (
    <>
      <Form
        form={form}
        onFieldsChange={onFieldsChange}
        onValuesChange={onValuesChange}
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
        {opts.AIDetection && (
          <Form.Item label={<FormattedMessage id="dataSource.form.AI" />} name="AIDetection">
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
        )}
        {opts?.keywordsReivewTitle && (
          <Form.Item
            label={<FormattedMessage id="Title Reivew Default Data" />}
            name="keywordsReivewTitle"
            // rules={[{ required: true, message: <FormattedMessage id="Please Select Title Reivew Default Data" /> }]}
          >
            <Checkbox.Group>
              {Object.keys(opts.keywordsReivewTitle).map((t, i) => {
                return (
                  <Checkbox key={`${t}${i}`} value={opts.keywordsReivewTitle[t]}>
                    <FormattedMessage id={zhCNMap[t]} />
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
        )}
        {opts?.keywordsReviewKeywords && (
          <Form.Item
            label={<FormattedMessage id="Keywords Review Default Data" />}
            name="keywordsReviewKeywords"
            // rules={[{ required: true, message: <FormattedMessage id="Please Select Keywords Review Default Data" /> }]}
          >
            <Checkbox.Group>
              {Object.keys(opts.keywordsReviewKeywords).map((t, i) => {
                return (
                  <Checkbox key={`${t}${i}`} value={opts.keywordsReviewKeywords[t]}>
                    <FormattedMessage id={zhCNMap[t]} />
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
        )}
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
            overlayStyle: { maxWidth: 400 },
            icon: <QuestionCircleOutlined />
          }}
        >
          <Radio.Group>
            {Object.keys(BatchGeneratedRules).map((t, i) => {
              return (
                <Radio value={BatchGeneratedRules[t]} key={`${t}${i}`}>
                  <FormattedMessage id={zhCNMap[t]} />
                </Radio>
              );
            })}
          </Radio.Group>
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
        {values.sensitiveCheckType?.length > 0 && (
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
        )}
      </Form>
    </>
  );
}
