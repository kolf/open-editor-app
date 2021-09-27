import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Input, Radio } from 'antd';
import options, {
  AIDetection,
  AIService,
  AssetType,
  AssignType,
  AuditType,
  KeywordAIService,
  KeywordAuditDefault,
  KeywordSensitiveCheckType,
  QualitySensitiveCheckType,
  SensitiveCheckType,
  SensitiveWordList,
} from 'src/declarations/enums/query';
import { ModalType } from '.';

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
    assignType: AssignType.人工分配
  },
  modalType
}: { saveRef: any, initialValues: any, modalType: ModalType }) {
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    // 如果弹窗为修改数据来源 且 审核类型只勾选质量审核、关键词审核其中一个
    if (modalType === ModalType.修改数据来源 && initialValues?.auditFlows?.length === 1) {
      if (initialValues?.auditFlows?.includes(AuditType.质量审核)) {
        setOptions({
          sensitiveCheckType: QualitySensitiveCheckType,
          AIDetection: AIDetection,
        })
      } else if (initialValues?.auditFlows?.includes(AuditType.关键词审核)) {
        setOptions({
          sensitiveCheckType: KeywordSensitiveCheckType,
          AIDetection: KeywordAIService,
          titleAuditDefault: KeywordAuditDefault,
          keywordAuditDefault: KeywordAuditDefault
        })
      }
    }
  }, [])

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

  const [form] = Form.useForm();

  useEffect(() => {
    saveRef(form);
  }, [form]);

  return (
    <>
      <Form
        form={form}
        onFieldsChange={onFieldsChange}
        initialValues={initialValues}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称！' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="资源类型" name="assetType" rules={[{ required: true, message: '请选择资源类型！' }]}>
          <Radio.Group>
            {Object.keys(AssetType).map((t, i) => (
              <Radio key={`${t}${i}`} value={AssetType[t]} disabled={AssetType[t] !== AssetType.图片}>
                {t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="审核类型" name="auditFlows" rules={[{ required: true, message: '请选择审核类型！' }]}>
          <Checkbox.Group>
            {Object.keys(AuditType).map((t, i) => {
              return (
                <Checkbox key={`${t}${i}`} value={AuditType[t]}>
                  {t}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="分配" name="assignType" rules={[{ required: true, message: '请选择分配！' }]}>
          <Radio.Group>
            {Object.keys(AssignType).map((t, i) => (
              <Radio value={AssignType[t]} key={`${t}${i}`} disabled={AssignType[t] !== AssignType.人工分配}>
                {AssignType[t] === AssignType.系统分配 ? `${t}（全部资源）` : t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="敏感检测" name="sensitiveCheckType">
          <Checkbox.Group>
            {Object.keys(options.sensitiveCheckType).map((t, i) => (
              <Checkbox key={`${t}${i}`} value={options.sensitiveCheckType[t]}>
                {t}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="敏感词表" name="sensitiveKeywordsTable" rules={[{
          required: false,
          message: '请选择敏感词表'
        }, ({ getFieldValue }) => ({
          validator(_, value) {
            const isSensitiveCheckExist = getFieldValue('sensitiveCheckType')?.length;
            const isSensitiveWordListExist = value?.length;
            if (isSensitiveCheckExist && !isSensitiveWordListExist) {
              return Promise.reject(new Error('请选择敏感词表'))
            } else if (!isSensitiveCheckExist && isSensitiveWordListExist) {
              return Promise.reject(new Error('请选择敏感检测'))
            }
            return Promise.resolve();
          }
        })]}>
          <Checkbox.Group>
            {Object.keys(SensitiveWordList).map((t, i) => (
              <Checkbox key={`${t}${i}`} value={SensitiveWordList[t]}>
                {t}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="AI服务" name="AIDetection">
          <Checkbox.Group>
            {Object.keys(options.AIDetection).map((t, i) => {
              return (
                <Checkbox key={`${t}${i}`} value={options.AIDetection[t]}>
                  {t}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
        {options?.titleAuditDefault && (
          <Form.Item label="标题审核默认数据" name="keywordsReivewTitle" rules={[{ required: true, message: '请选择标题审核默认数据！' }]}>
            <Checkbox.Group>
              {Object.keys(options.titleAuditDefault).map((t, i) => {
                return (
                  <Checkbox key={`${t}${i}`} value={options.titleAuditDefault[t]}>
                    {t}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
        )}
        {options?.keywordAuditDefault && (
          <Form.Item label="关键词审核默认数据" name="keywordsReviewKeywords"  rules={[{ required: true, message: '请选择关键词审核默认数据！' }]}>
            <Checkbox.Group>
              {Object.keys(options.keywordAuditDefault).map((t, i) => {
                return (
                  <Checkbox key={`${t}${i}`} value={options.keywordAuditDefault[t]}>
                    {t}
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
