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
  fixed?: 'left' | 'right' | boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, tr: any) => React.ReactNode;
}

declare interface Menu {
  key: string;
  name: string;
  hasChild: boolean;
  icon?: string;
  path?: string;
  breadcrumbName: string;
  hidden: boolean;
  children?: Menu[];
}

declare interface AntdOptions {
  value: string;
  label: string;
}
