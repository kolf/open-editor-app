declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare type AlignType = 'left' | 'center' | 'right';
declare type FixedType = 'left' | 'right' | boolean;

declare interface Column<T = any> {
  title: ReactElement;
  dataIndex?: string;
  width?: number;
  fixed?: FixedType;
  align?: AlignType;
  render?: (value: any, tr: T) => React.ReactNode;
}

declare interface AntdOptions {
  value: string;
  label: string;
}

declare interface Option {
  value: string | number;
  label: string;
}

declare type IdList = number[];
