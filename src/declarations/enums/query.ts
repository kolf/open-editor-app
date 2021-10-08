/* 查询条件枚举  */

// 入库时间
export enum InStorageTime {
  今日 = '1',
  昨天 = '2',
  近一周 = '3'
}

// 分配模式
export enum AssignType {
  人工 = '1',
  自动 = '2'
}

// 优先级
export enum Priority {
  正常 = '1',
  加急 = '2'
}

// 敏感检测
export enum IfSensitveCheck {
  未命中敏感词 = '0',
  命中敏感词 = '1'
}

// 是否敏感检测
export enum IfSensitveCheckBool {
  否 = '0',
  是 = '1'
}

// AI检测
export enum AIDetection {
  AI质量评分 = '0',
  AI美学评分 = '1',
  AI分类 = '2'
}

// 资源/审核类型
export enum AssetType {
  图片 = '1',
  视频 = '2',
  音频 = '3'
}

// 资源分类
export enum AssetFamily {
  创意类 = '2',
  编辑类 = '1'
}

// 数据来源状态
export enum OsiDbProviderStatus {
  禁用 = '0',
  开通 = '1'
}

// 批次分配状态
export enum BatchAssignStatus {
  未分配 = '1',
  分配中 = '2',
  分配完成 = '3'
}

// 授权文件
export enum LicenseType {
  RM = '1',
  RF = '2'
}

// 质量等级
export enum Quality {
  A = '1',
  B = '2',
  C = '3',
  D = '4'
}

// 授权
export enum CopyrightType {
  未取得物权授权 = '7',
  已取得肖像权授权 = '1',
  已取得肖像权和物权授权 = '2',
  已取得物权授权 = '3',
  未取得肖像权或物权授权 = '9',
  不涉及肖像权或物权授权 = '0'
}

// 分配方式
export enum BatchAssignMode {
  系统 = '1',
  人工 = '2'
}

// 审核类型（临时方案）
export enum BatchAuditType {
  '创意类质量审核（一审）' = '1'
}

// 批次分配对象
export enum BatchAssignTarget {
  全部资源 = '1',
  编辑 = '2'
}

// 批次入库状态
export enum BatchStatus {
  入库中 = '1',
  入库完成 = '2',
  审核中 = '3',
  审核完成 = '4',
  回调完成 = '5'
}

// 审核状态
export enum QualityStatus {
  '待编审' = '14',
  '已通过' = '24',
  '不通过' = '34'
}

export enum KeywordsStatus {
  '待编审' = '14',
  '待编审(免审)' = '15',
  '已通过' = '24',
  '不通过' = '34'
}

export enum IfHaveRelease {
  无 = '0',
  有 = '1'
}

export enum Exclusive {
  非独家 = '0',
  独家 = '1'
}

export enum License {
  肖像权文件 = '1',
  物权文件 = '2',
  拍摄许可文件 = '3'
}

class Options {
  map(enumObj) {
    return Object.keys(enumObj).reduce((result, key) => {
      result[enumObj[key]] = key;
      return result;
    }, {});
  }
  get(enumObj): Option[] {
    return Object.keys(enumObj).reduce((result, key) => {
      result.push({
        value: enumObj[key],
        label: key
      });
      return result;
    }, []);
  }
}

const options = new Options();

export default options;
