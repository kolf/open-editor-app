import React, { ReactElement, useState, useEffect } from 'react';
import KeywordTextArea, { getValueType, uniq } from './KeywordTextArea';

export type ModeType = 'all' | 'source' | 'kind';

type Props<T> = {
  mode: ModeType;
  size?: 'small' | 'default';
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[], addedValue: T[], removedValue: T[]) => void;
};

const defaultKinds: Option[] = [
  {
    label: '主题',
    value: 0
  },
  {
    label: '概念',
    value: 1
  },
  {
    label: '规格',
    value: 2
  },
  {
    label: '人物',
    value: 3
  },
  {
    label: '地点',
    value: 4
  }
];

const sourceTypes: Option[] = [
  {
    label: 'AI关键词（用户勾选）',
    value: 0
  },
  {
    label: 'AI关键词（用户未勾选） ',
    value: 1
  },
  {
    label: '用户提供关键词',
    value: 2
  },
  {
    label: '编辑添加关键词',
    value: 3
  },
  {
    label: '编辑删除关键词',
    value: 4
  }
];

export default React.memo(function KeywordTextAreaGroup({
  size,
  mode,
  value: propsValue,
  defaultValue = [],
  onChange
}: Props<IKeywordsTag>): ReactElement {
  const [value, setValue] = useState(defaultValue || propsValue);

  useEffect(() => {
    if (propsValue && JSON.stringify(propsValue) !== JSON.stringify(value)) {
      setValue(propsValue);
    }
  }, [propsValue]);

  const getValueByKind = (kind: number): IKeywordsTag[] => {
    if (kind === -1) {
      return value.reduce((result, item) => {
        const valueType = getValueType(item);
        if (valueType != 1) {
          result.push(item);
        }
        return result;
      }, []);
    }
    return value.filter(v => v.kind === kind);
  };

  const handleChange = <T extends IKeywordsTag>(nextValue: T[], addedValue: T[]) => {
    const removedValue: T[] = value.filter(v => !nextValue.find(nv => v.value === nv.value)) as T[];

    setValue(nextValue);

    onChange && onChange(nextValue, addedValue, removedValue);
  };

  if (mode === 'source') {
    // TODO 按来源展示，等接口。。。
    return (
      <>
        {sourceTypes.map(sourceType => {
          const currentValue = getValueByKind(sourceType.value as number);
          return (
            <div key={sourceType.value} style={{ paddingBottom: 6 }}>
              <KeywordTextArea
                height={size === 'small' ? 60 : 80}
                title={sourceType.label}
                value={currentValue}
                added={!!onChange}
                onChange={(newValue, addedValue) => {
                  const otherValue = value.filter(v => !currentValue.find(cv => cv.value === v.value));
                  const nextValue = uniq([...otherValue, ...newValue]);
                  handleChange(nextValue, addedValue);
                }}
              />
            </div>
          );
        })}
      </>
    );
  }
  if (mode === 'kind') {
    return (
      <>
        {[...defaultKinds, { label: '其他或不确定关键词', value: -1 }].map(kind => {
          const currentValue = getValueByKind(kind.value as number);
          const placeholder = `请输入${kind.label}关键词`;
          return (
            <div key={kind.value} style={{ paddingBottom: 6 }}>
              <KeywordTextArea
                height={size === 'small' ? 60 : 80}
                title={kind.label + '关键词'}
                placeholder={placeholder}
                value={currentValue}
                added={!!onChange}
                onChange={(newValue, addedValue) => {
                  const otherValue = value.filter(v => !currentValue.find(cv => cv.value === v.value));
                  const nextValue = uniq([...otherValue, ...newValue]);
                  handleChange(nextValue, addedValue);
                }}
              />
            </div>
          );
        })}
      </>
    );
  }
  return <KeywordTextArea height={200} title="关键词" value={value} added={!!onChange} onChange={handleChange} />;
});
