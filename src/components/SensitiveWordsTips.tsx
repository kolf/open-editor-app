import * as React from 'react';
import { useHover } from 'ahooks';

interface Props {
  dataSource: any[];
}

function parse(dataSource: any[]) {
  return dataSource.reduce((result, item) => {
    if (!item) {
      return result;
    }
    if (/^(0|1)$/.test(item.checkType)) {
      const value = (item.elephantSensitiveWord || '').replace(/(^,+|,+$)/g, '').replace(/,{1,}/g, ',');
      if (result[item.elephantCategoryTitle]) {
        result[item.elephantCategoryTitle].push(value);
      } else {
        result[item.elephantCategoryTitle] = [value];
      }
    } else {
      const value = (item.sensitiveWord || '').replace(/(^,+|,+$)/g, '').replace(/,{1,}/g, ',');
      if (result[item.sensitiveLabelTxt]) {
        result[item.sensitiveLabelTxt].push(value);
      } else {
        result[item.sensitiveLabelTxt] = [value];
      }
    }
    return result;
  }, {});
}

function stringify(dataSource: any[]): string {
  const data = parse(dataSource);
  if (!data) {
    return '';
  }
  return Object.keys(data)
    .reduce((result, key) => {
      const value = data[key].join(',');
      if (value) {
        result.push(`${key}：${value}`);
      } else {
        result.push(key);
      }
      return result;
    }, [])
    .join('，');
}

export default function SensitiveWordsTips({ dataSource }: Props): React.ReactElement {
  const ref = React.useRef();
  const isLeave = useHover(ref);
  if (dataSource.length === 0) {
    return <div ref={ref} />;
  }
  const data = parse(dataSource);

  const getStyle = (): React.CSSProperties => {
    return {
      position: 'absolute',
      zIndex: 11,
      top: 0,
      paddingLeft: 4,
      paddingRight: 4,
      left: 0,
      height: isLeave ? 'auto' : 22,
      width: isLeave ? 'auto' : '50%',
      overflow: 'hidden',
      backgroundColor: '#333',
      color: '#fff'
    };
  };

  return (
    <div ref={ref} style={getStyle()}>
      {Object.keys(data).map(key => (
        <p key={key} style={{ margin: 0, padding: 2 }}>
          <span>{key}：</span>
          {data[key].join('，')}
        </p>
      ))}
    </div>
  );
}
