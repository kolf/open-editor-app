import React, { ReactElement } from 'react';
import KeywordTextArea, { uniq } from './KeywordTextArea';

export type ModeType = 'all' | 'source' | 'kind';

type Props<T> = {
  mode: ModeType;
  langType?: IImage['osiKeywodsData']['langType'];
  size?: 'small' | 'default';
  readOnly?: boolean;
  value?: T[];
  onChange?: (value: T[], addedValue: T[], removedValue: T[]) => void;
};

//
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

const removedSourceType = `aiKeywordsSelectedDel|aiKeywordsUnselectedDel|userKeywordsDel|userKeywordsAuditDel`;
export const removedSourceTypeReg = new RegExp(`^(${removedSourceType})$`);
const addedSourceTypeReg = new RegExp(`^(${removedSourceType.replaceAll('Del', '')})$`);

const sourceTypes: Option[] = [
  {
    label: 'AI关键词（用户勾选）',
    value: 'aiKeywordsSelected'
  },
  {
    label: 'AI关键词（用户未勾选） ',
    value: 'aiKeywordsUnselected'
  },
  {
    label: '用户提供关键词',
    value: 'userKeywords|userKeywordsAudit'
  },
  {
    label: '编辑添加关键词',
    value: 'editorKeywordsAdd'
  },
  {
    label: '编辑删除关键词',
    value: removedSourceType
  }
];

export const updateValueSource = <T extends IKeywordsTag>(value: T[], nextValue: T[]): [T[], T[], T[]] => {
  const addedValue = nextValue
    .filter(nv => !value.find(v => v.value === nv.value))
    .map(av => ({ ...av, source: 'editorKeywordsAdd' }));

  const removedValue = value.filter(v => {
    if (v.type === 2 && addedValue.length > 0 && addedValue.every(av => v.value.split(',').includes(av.value))) {
      return true;
    }
    return v.source === 'editorKeywordsAdd' && !nextValue.find(nv => nv.value === v.value);
  }) as T[];

  // console.log(addedValue, value, nextValue, removedValue, 'value');
  // const reg = new;
  const changedValue = [
    ...value
      .filter(v => !nextValue.find(nv => nv.value === v.value))
      .reduce((result, rv) => {
        if (rv.source === 'editorKeywordsAdd') {
          return result;
        }
        let nextSource: IKeywordsTag['source'] = rv.source;
        if (addedSourceTypeReg.test(rv.source)) {
          nextSource = (rv.source + 'Del') as IKeywordsTag['source'];
        } else if (removedSourceTypeReg.test(rv.source)) {
          nextSource = rv.source.replaceAll('Del', '') as IKeywordsTag['source'];
        }

        return [
          ...result,
          {
            ...rv,
            source: nextSource
          }
        ];
      }, [])
  ];

  return [
    uniq([
      ...value
        .filter(v => !removedValue.find(rv => rv.value === v.value))
        .map(v => changedValue.find(cv => cv.value === v.value) || v),
      ...addedValue
    ]),
    addedValue,
    removedValue
  ];
};

export default React.memo(function KeywordTextAreaGroup({
  size,
  mode,
  langType,
  readOnly,
  value,
  onChange
}: Props<IKeywordsTag>): ReactElement {
  const filterRemovedValue = (): IKeywordsTag[] => value.filter(item => !removedSourceTypeReg.test(item.source));

  const getValueByKind = (kind: number): IKeywordsTag[] => {
    if (kind === -1) {
      return filterRemovedValue().reduce((result, item) => {
        if (item.type != 1) {
          result.push(item);
        }
        return result;
      }, []);
    }
    return filterRemovedValue().filter(v => v.kind === kind);
  };

  const getValueBySource = (source: string): IKeywordsTag[] => {
    const reg = new RegExp('^(' + source + ')$');
    return uniq(value.filter(v => reg.test(v.source)));
  };

  const handleChange = <T extends IKeywordsTag>(newValue: T[], addedValue: T[], removedValue: T[]) => {
    const nextValue = uniq([...value, ...addedValue].filter(v => !removedValue.find(rv => rv.value === v.value)));
    onChange && onChange(...updateValueSource(value, nextValue));
  };

  if (mode === 'source') {
    // TODO 按来源展示，等接口。。。
    return (
      <>
        {sourceTypes.map(sourceType => {
          const currentValue = getValueBySource(sourceType.value as string);
          return (
            <div key={sourceType.value} style={{ paddingBottom: 6 }}>
              <KeywordTextArea
                langType={langType}
                height={size === 'small' ? 60 : 80}
                title={sourceType.label}
                placeholder={sourceType.label}
                value={currentValue}
                action={
                  readOnly ? [] : sourceType.value === removedSourceType ? ['remove'] : ['add', 'remove', 'select']
                }
                onChange={handleChange}
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
                langType={langType}
                height={size === 'small' ? 60 : 80}
                title={kind.label + '关键词'}
                placeholder={placeholder}
                value={currentValue}
                action={readOnly ? [] : ['add', 'remove', 'select']}
                onChange={handleChange}
              />
            </div>
          );
        })}
      </>
    );
  }
  if (mode === 'all') {
    return (
      <KeywordTextArea
        langType={langType}
        height={200}
        title="关键词"
        value={filterRemovedValue()}
        action={readOnly ? [] : ['add', 'remove', 'select']}
        onChange={handleChange}
      />
    );
  }
});
