export namespace CommonSchema {
  // 编辑
  export interface EditUserList {
    user: [{
      partyId: string; // 用户Id
      name: string; // 用户姓名}
    }];
  }

  // AI分类
  export interface CategoryList {}

  export interface TableList<T = any> {
    total: number;
    list: T[]
  }
}
