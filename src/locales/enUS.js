import zhCN from './zhCN';
import component from './en-US/component.json';

export default Object.keys(zhCN).reduce((memo, item) => {
  memo[item] = item;
  return memo;
}, {});
