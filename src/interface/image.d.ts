interface IRelease {
  id: number;
  osiImageId: number;
  name: string;
  type: number;
  url: string;
  memo: string;
  status?: any;
  createdTime?: any;
  updatedTime?: any;
}

declare interface IKeywordsTag extends Option {
  value: string;
  color?: string;
  kind?: number;
}

declare interface IOsiImageReview {
  osiImageId: number;
  qualityStatus: '14' | '24' | '34';
  keywordsStatus: '14' | '24' | '34';
  securityStatus?: any;
  qualityAuditorId?: number;
  keywordsAuditorId: number;
  securityAuditorId?: any;
  qualityEditTime?: any;
  keywordsEditTime?: any;
  securityEditTime?: any;
  createdTime: string;
  priority: number;
  providerResId: string;
  osiBatchId: number;
  osiProviderId: number;
  callbackStatus: number;
}

// 图片操作方法
declare type IImageActionType =
  | 'id'
  | 'cover'
  | 'middleImage'
  | 'originImage'
  | 'resolve'
  | 'reject'
  | 'logs'
  | 'releases';

declare interface IImageQuery {}

declare type IImage = Partial<{
  id: number;
  keywordTags: IKeywordsTag[];
  providerResId: string;
  osiBatchId: number;
  osiProviderId: number;
  assetFamily: number;
  title: string;
  category: string;
  keywords: string;
  caption: string;
  qualityRank: '1' | '2' | '3' | '4';
  licenseType: '1' | '2';
  copyright: string;
  urlSmall: string;
  urlYuan: string;
  aiQualityScore: number;
  aiBeautyScore: number;
  standardReason?: any;
  customReason?: any;
  memo: string;
  createdTime: string;
  updatedTime: string;
  exclusive: number;
  reasonTitle: string;
  osiProviderName: string;
  categoryNames: string;
  osiImageReview: IOsiImageReview;
  osiKeywods?: any;
  releases: IRelease[];
  sensitiveList: any[]; // TODO 待优化
}>;

declare interface IImageResponse {
  total: number;
  list: IImage[];
}
