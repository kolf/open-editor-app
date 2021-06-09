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
  人工,
  自动
}

// 优先级
export enum Priority {
  正常,
  加急
}

// 敏感检测
export enum SensitiveDetection {
  检测,
  不检测
}

// AI检测
export enum AIDetection {
  AI质量评分,
  AI分类
}