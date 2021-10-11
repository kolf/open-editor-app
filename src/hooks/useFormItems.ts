import { useLanguagePkg } from './useLanguage';

export type IFormItem = {
  key: number;
  field: string;
  formType: IFormType;
  placeholder: string;
  options?: Option[];
  restProps?: any;
};

export type IFormType = 'TimeRange' | 'Select' | 'SearchSelect' | 'InputSplit';

export type IFormItemKey = number | { key: number; options: Option[] };

export default function useFormItems(formItemKeys: IFormItemKey[]): IFormItem[] {
  const { languagePkg } = useLanguagePkg();

  console.log(languagePkg, 'languagePkg');

  const formItems: IFormItem[] = [
    {
      key: 1,
      field: 'createdTime',
      formType: 'TimeRange',
      placeholder: languagePkg['formItem.createdTime'],
      restProps: {
        width: 240
      }
    },
    {
      key: 2,
      field: 'qualityEditTime',
      formType: 'TimeRange',
      // placeholder: '审核时间'
      placeholder: languagePkg['formItem.editTime']
    },
    {
      key: 3,
      field: 'qualityAuditorId',
      formType: 'SearchSelect',
      // placeholder: '审核人',
      placeholder: languagePkg['formItem.qualityAuditorId'],
      restProps: {
        type: 'editUser'
      }
    },
    {
      key: 4,
      field: 'qualityStatus',
      formType: 'Select',
      // placeholder: '审核状态',
      placeholder: languagePkg['formItem.qualityStatus'],
      options: [
        { value: '14', label: '待编审' },
        { value: '24', label: '已通过' },
        { value: '34', label: '不通过' }
      ]
    },
    {
      key: 5,
      field: 'osiProviderId',
      formType: 'SearchSelect',
      // placeholder: '数据来源',
      placeholder: languagePkg['formItem.osiProviderId'],
      restProps: {
        type: 'provider'
      }
    },
    {
      key: 6,
      field: 'aiQualityScore',
      formType: 'InputSplit',
      // placeholder: 'AI质量评分'
      placeholder: languagePkg['formItem.aiQualityScore']
    },
    {
      key: 7,
      field: 'aiBeautyScore',
      formType: 'InputSplit',
      // placeholder: 'AI美学评分'
      placeholder: languagePkg['formItem.aiBeautyScore']
    },
    {
      key: 8,
      field: 'qualityRank',
      formType: 'Select',
      // placeholder: '质量等级',
      placeholder: languagePkg['formItem.qualityRank'],
      options: [
        { value: '1', label: 'A' },
        { value: '2', label: 'B' },
        { value: '3', label: 'C' },
        { value: '4', label: 'D' }
      ]
    },
    {
      key: 9,
      field: 'priority',
      formType: 'Select',
      // placeholder: '优先级',
      placeholder: languagePkg['formItem.priority'],
      options: [
        { value: '1', label: '正常' },
        { value: '2', label: '加急' }
      ]
    },
    {
      key: 10,
      field: 'license',
      formType: 'Select',
      // placeholder: '授权文件',
      placeholder: languagePkg['formItem.license'],
      options: [
        { value: '1', label: '肖像权文件' },
        { value: '2', label: '物权文件' },
        { value: '3', label: '拍摄许可文件' }
      ]
    },
    {
      key: 11,
      field: 'haveSensitve',
      formType: 'Select',
      // placeholder: '敏感词',
      placeholder: languagePkg['formItem.haveSensitve'],
      options: [
        { value: '0', label: '未命中敏感词' },
        { value: '1', label: '命中敏感词' }
      ]
    },
    {
      key: 12,
      field: 'licenseType',
      formType: 'Select',
      // placeholder: '授权',
      placeholder: languagePkg['formItem.licenseType'],
      options: [
        { value: '1', label: 'RM' },
        { value: '2', label: 'RF' }
      ]
    },
    {
      key: 13,
      field: 'category',
      formType: 'Select',
      // placeholder: 'AI分类'
      placeholder: languagePkg['formItem.category']
    },
    {
      key: 14,
      field: 'keywordsStatus',
      formType: 'Select',
      // placeholder: '审核状态',
      placeholder: languagePkg['formItem.keywordsStatus'],
      options: [
        { value: '14', label: '待编审' },
        { value: '15', label: '待编审(免审)' },
        { value: '24', label: '已通过' },
        { value: '34', label: '不通过' }
      ]
    }
  ];

  const getFormItems = (formItemKeys: IFormItemKey[]): IFormItem[] => {
    return formItemKeys.map(key => {
      if (typeof key === 'number') {
        return (formItems as IFormItem[]).find(item => item.key === key);
      } else {
        return {
          ...(formItems as IFormItem[]).find(item => item.key === key.key),
          ...key
        };
      }
    });
  };

  return getFormItems(formItemKeys);
}
