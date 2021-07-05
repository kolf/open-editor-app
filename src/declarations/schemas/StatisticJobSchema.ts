export namespace StatisticJobSchema {
  export interface ListALl {
    dismissTotal: number; // 审核驳回数量
    passTotal: number; // 审核通过数量
    userName: string; // 编辑姓名
    userId: number; // 编辑Id
  }
}
