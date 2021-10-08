import { BatchAssignMode, BatchAssignStatus, BatchAuditType, IfSensitiveCheck, Priority } from '../enums/query';

export namespace OsiBatchSchema {
  // 图片数据分配列表
  export interface PageList {
    id: number;
    createdTime: number; // 入库时间
    name: string; // 名称
    auditFlow: BatchAuditType; // 审核类型
    assignMode: BatchAssignMode; // 分配类型
    priority: Priority; // 优先级
    ifSensitveCheck: IfSensitiveCheck; // 敏感检测
    ifAiQualityScore: boolean; // AI质量评分
    ifAiBeautyScore: boolean; // AI美学评分
    ifAiCategory: boolean; // AI分类
    quantity: number; // 数量
    assignTime: number; // 分配时间
    assignStatus: BatchAssignStatus; // 分配状态
    auditorName: string; // 分配对象
    assignerName: string; // 分配人
  }
}
