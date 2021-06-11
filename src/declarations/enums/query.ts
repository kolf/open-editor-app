/* 查询条件枚举  */

// 入库时间
export enum InStorageTime {
  今日 = "1",
  昨天 = "2",
  近一周 = "3"
}
// 分配状态
export enum DistributeState {
  未分配,
  分配中,
  分配完成,
}

// 数据来源
export enum DataSource {
  '500px.me',
  '500px.com',
}

// 分配模式
export enum DistributeMode {
  人工 = '0',
  自动 = '1'
}

// 优先级
export enum Priority {
  正常,
  加急
}

// 敏感检测
export enum SensitiveDetection {
  检测 = '0',
  不检测 = '1'
}

// AI检测
export enum AIDetection {
  AI质量评分 = '0',
  AI美学评分 = '1',
  AI分类 = '2'
}

// 资源/审核类型
export enum AssetType {
  图片 = '0',
  视频 = '1'
}

export enum AssetFamily {
  创意类 = '0',
  编辑类 = '1'
}

export const assetFamilyMap = Object.keys(AssetFamily).reduce((memo, a) => {
  memo[AssetFamily[a]] = a;
  return memo;
}, {})