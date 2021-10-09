import zhCN from "./zhCN";

export default Object.keys(zhCN).reduce((memo, item) => {
  memo[item] = item;
  return memo;
}, {});