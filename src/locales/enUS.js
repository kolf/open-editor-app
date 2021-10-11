import zhCN from './zhCN';
import component from './en-US/component.json';
import image from './en-US/image.json';
import keywords from './en-US/keywords.json';
import system from './en-US/system.json';

export default Object.keys(zhCN).reduce(
  (memo, item) => {
    if (memo[item]) {
      return memo;
    }
    memo[item] = item;
    return memo;
  },
  {
    ...component,
    ...image,
    ...keywords,
    ...system
  }
);
