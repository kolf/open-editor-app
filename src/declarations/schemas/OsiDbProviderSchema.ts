import { AssetFamily, AssetType } from '../enums/query';

export namespace OsiDbProviderSchema {
  // 供应商列表
  export interface ListAll {
    auditFlows: string;
    nameEn: string;
    name: string; // 名称
    id: number; // id
    assetFamily: AssetFamily; // 资源分类
    assetType: AssetType; // 资源/审核类型
  }
}
