// 导航
export const menuPart = {
  'Data Distribution': '数据分配',
  'Source Management': '数据来源管理',
  'Photo Distribution': '图片数据分配',
  'Quality Review': '质量审核',
  'Metadata Review': '关键词审核',
  'Video Distribution': '视频数据分配',

  'All Resources': '全部资源',
  'My Tasks': '我的审核',
  Stats: '数据统计',
}

// 选择器
export const selectPart = {
  'Submission Date': '入库时间',

  'Distribution Stats': '分配状态',
  'To Do': '未分配',
  'In Progress': '分配中',
  Done: '分配完成',

  Editors: '分配对象',

  Source: '数据来源',

  Distribution: '分配',
  Auto: '系统',
  Manual: '人工',

  'NSFW Scan': '敏感检测',
  Original: '入库检测',
  Reviewed: '提交检测',

  Priority: '优先级',
  'Medium(Normal)': '正常',
  High: '加急',

  'NSFW Keywords': '敏感词表',
  China: '国内敏感词表',
  International: '国外敏感词表',

  AI: 'AI服务',
  'LAI Quality': 'AI质量评分',
  'AAI Aesthetic': 'AI美学评分',
  'AI Categories': 'AI分类',
  'AI Title-Keywords' :'AI自动标题/关键词'
}

const otherPart = {
  'Inspection Platform': '内容审核管理平台',
  'Modify Password': '修改密码',
  'New Password':'新密码',
  'Confirm New Password':'新密码',

  Exit: '退出',
  Login: '登录',
  'Remember Username': '记住用户名'
}

const table = {
  'No.': '序号',
  'ID': 'ID',
  Amount: '数量',
  'Distribution Date': '分配时间',
  Administrators: '分配人',
  Action: '操作',

  'Create Source': '创建数据来源',
  'Edit Source': '编辑数据来源',
  'CreatedTime': '创建时间',
  'Source Name': '数据来源名称',
  'Audit Flow': '审核类型',
  'Asset Type': '资源类型',
  Image: '图片',
  Video: '视频',
  Audio: '音频',
  Creator: '创建人',
  Status: '状态',
  Open: '开通',
  Close: '关闭',
  Edit: '编辑',
  'Confirm Close?': '是否确认关闭？',
  'Confirm Open?': '是否确认开通？',
  'Distribution Success': '设置分配成功',

  Name: '名称',
  'Keywords Reivew Title': '标题审核默认数据',
  'Keywords Review Keywords': '关键词审核默认数据',

  AI: 'AI'
}

export default {
  ...menuPart,
  ...selectPart,
  ...otherPart,
  ...table
};