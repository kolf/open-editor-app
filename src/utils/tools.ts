export const trim = <T extends string>(text?: T): T => {
  return (text ? text.replace(/^\s+|\s+$/g, '') : '') as T;
};
