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

type IKeywordKind = 0 | 1 | 2 | 3 | 4;

declare interface IKeywordsTag {
  label: string;
  value: string;
  color?: string;
  kind?: IKeywordKind;
  type: 0 | 1 | 2;
  source?: keyof IKeywordsAll;
}

// {
//   "aiKeywordsSelected": "75846,43611,109159",
//   "aiKeywordsSelectedDel": "96603,96603,75846",
//   "aiKeywordsUnselected": "33153,33271,8570",
//   "aiKeywordsUnselectedDel": "96603",
//   "userKeywords": "13804,30284",
//   "userKeywordsDel": "30120",
//   "userKeywordsAudit": "轮船|43614::43616::43621|2|0,织女星||0|0,昼夜||0|0,快慢||0|0,分秒必争||0|0",
//   "userKeywordsAuditDel": "长岛县|74737::120232|2|0,水藻||0|0",
//   "editorKeywordsAdd": "32905,76427,33857"
// }
declare interface IKeywordsAll {
  aiKeywordsSelected: string;
  aiKeywordsSelectedDel: string;
  aiKeywordsUnselected: string;
  aiKeywordsUnselectedDel: string;
  userKeywords: string;
  userKeywordsDel: string;
  userKeywordsAudit: string;
  userKeywordsAuditDel: string;
  editorKeywordsAdd: string;
}

interface IOsiKeywodsData {
  langType: 1 | 2; // 语言类型：1=中文；2=英文
  osiImageId: number;
  aiTitle: string;
  keywordsAudit: string;
  keywordsAll: string;
  createdTime: string;
  updatedTime: string;
  aiProcessStatus: number;
}
declare interface IOsiImageReview {
  osiImageId: number;
  qualityStatus: '14' | '24' | '34';
  keywordsStatus: '14' | '15' | '24' | '34';
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
  callbackStatus: 1 | 2;
  keywordsCallbackStatus: 1 | 2;
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
  copyright: '0' | '1' | '2' | '3' | '7' | '9';
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
  keywordTags: IKeywordsTag[];
  osiImageReview: IOsiImageReview;
  osiKeywodsData: IOsiKeywodsData;
  releases: IRelease[];
  releaseType: '1' | '2' | '3';
  sensitiveWords: string; // TODO 待优化
  sensitiveWordList: any[]; // TODO 待优化
}>;

declare interface IImageResponse {
  total: number;
  list: IImage[];
}
