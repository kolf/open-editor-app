import options, {
  Priority,
  Quality,
  License,
  LicenseType,
  KeywordsStatus,
  IfSensitveCheck
} from 'src/declarations/enums/query';

export type FormType = 'TimeRange' | 'Select' | 'SearchSelect' | 'InputSplit';

export type IFormItem = {
  key: number;
  field: string;
  formType: FormType;
  placeholder: string;
  options?: Option[];
  restProps?: any;
};


const qualityStatusOptions = options.get(KeywordsStatus);
const priorityOptions = options.get(Priority);
const qualityOptions = options.get(Quality);
const licenseOptions = options.get(License);
const ifSensitveCheckOptions = options.get(IfSensitveCheck);
const LicenseTypeOptions = options.get(LicenseType);

const formData: IFormItem[] = [
  {
    key: 1,
    field: 'createdTime',
    formType: 'TimeRange',
    placeholder: '入库时间'
  },
  {
    key: 2,
    field: 'qualityEditTime',
    formType: 'TimeRange',
    placeholder: '审核时间'
  }
];

export default formData;
