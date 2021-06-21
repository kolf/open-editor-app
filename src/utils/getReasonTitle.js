export const getReasonTitle = (map, value, otherValue?: string): string => {
  if (!value && !otherValue) {
    return '';
  }
  const valueList = typeof value === 'string' ? value.match(/\d+/g) : value;
  let result = (valueList || []).filter(v => map.has(v)).map(v => map.get(v));
  if (otherValue) {
    result.push(otherValue);
  }
  return result.join(',');
};

export const reasonDataToMap = treeData => {
  let result = new Map();
  const loop = data => {
    data.forEach(item => {
      const key = item.id + '';
      result.set(key, item.desc);
      if (item.childNodes) {
        loop(item.childNodes);
      }
    });
  };
  loop(treeData);
  return result;
};
