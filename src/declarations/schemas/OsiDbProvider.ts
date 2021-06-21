import { AssetFamily, AssetType } from "../enums/query";

export namespace OsiDbProvider {
  export interface ListAll {
    name: string; // 名称
    id: number; // id
    assetFamily: AssetFamily; // 资源分类
    assetType: AssetType; // 资源/审核类型
  }
}