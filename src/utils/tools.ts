import { compose } from "redux";
import options from "src/declarations/enums/query";
import { zhCNMap } from "src/locales/zhCN";

export const trim = <T extends string>(text?: T): T => {
  return (text ? text.replace(/^\s+|\s+$/g, '') : '') as T;
};

export const getTableDisplay = (v, enums) => {
  return compose(
    v => zhCNMap[v as string],
    v => options.map(enums)[v]
  )(v)
}