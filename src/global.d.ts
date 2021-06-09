declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare interface Column {
  title: string;
  dataIndex?: string;
  width?: number;
  render?: (value: any, tr: any) => JSX.Element;
}

declare interface Menu {
  key: string,
  name: string,
  hasChild: boolean,
  icon?: string,
  path?: string,
  breadcrumbName: string,
  hidden: boolean,
  children?: Menu[]
}