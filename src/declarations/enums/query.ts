/* 查询条件枚举  */

// 入库时间
export enum inStorageTime {
  今日 = "1",
  昨天 = "2",
  近一周 = "3"
}
// 分配状态
export enum distributeState {
  未分配,
  分配中,
  分配完成,
}

// 数据来源
export enum dataSource {
  '500px.me',
  '500px.com',
}

// 分配模式
export enum distributeMode {
  人工,
  自动
}

// 优先级
export enum priority {
  正常,
  加急
}

// 敏感检测
export enum sensitiveDetection {
  检测,
  不检测
}

// AI检测
export enum AIDetection {
  AI质量评分,
  AI分类
}


