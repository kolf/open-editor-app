import options from 'src/declarations/enums/query';
import component from './zh-CN/component.json';
import image from './zh-CN/image.json';
import keywords from './zh-CN/keywords.json';
import system from './zh-CN/system.json';

// 导航
export const menuPart = {
  'Data Distribution': '数据分配',
  'Source Management': '数据来源管理',
  'Photo Distribution': '图片数据分配',
  'Quality Review': '质量审核',
  'Metadata Review': '关键词审核',
  'Video Distribution': '视频数据分配',

  'All Resources': '全部资源',
  'Photo Review': '图片审核',
  'My Tasks': '我的审核',
  Stats: '数据统计'
};

// 选择器
export const selectPart = {
  'Submission Date': '入库时间',

  'Distribution Stats': '分配状态',
  'To Do': '未分配',
  'In Progress': '分配中',
  Done: '分配完成',

  Editors: '分配对象',

  'Data Source': '数据来源',

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
  'AI Title-Keywords': 'AI自动标题/关键词'
};

const otherPart = {
  'Inspection Platform': '内容审核管理平台',
  'Modify Password': '修改密码',
  'New Password': '新密码',
  'Old Password': '旧密码',
  'Confirm New Password': '确认新密码',

  Exit: '退出',
  Login: '登录',
  'Remember Username': '记住用户名',

  'Enter Keywords or ID, using "," to search multiples': '请输入关键词或ID，多个用逗号隔开'
};

const table = {
  'No.': '序号',
  ID: 'ID',
  Amount: '数量',
  'Distribution Date': '分配时间',
  Administrators: '分配人',
  Actions: '操作',

  'Create Data Source': '创建数据来源',
  'Edit Data Source': '编辑数据来源',
  'Created Date': '创建时间',
  'Inspection Type': '审核类型',
  'Resource Type': '资源类型',
  Photo: '图片',
  Video: '视频',
  Audio: '音频',
  Creator: '创建人',
  Status: '状态',
  Open: '开通',
  Close: '关闭',
  Edit: '编辑',
  
  'Confirm Close?': '是否确认关闭？',
  'Confirm Open?': '是否确认开通？',
  'Distribution Success': '设置分配成功！',
  'Batch Rules': '批次生成规则',
  'Automatic': '系统自动生成',
  "A batch is generated when 5000 pictures are met or the creation time exceeds 12 hours": "满5000张/创建时间超过12小时生成一个批次",
  manual: '手动生成',
  "Push to generate one batch at a time": "推送一次生成一个批次",

  Title: '名称',
  'Please enter the data source name, no more than 200 characters': '请输入数据来源名称，不超过200个字符',
  'Title Reivew Default Data': '标题审核默认数据',
  'Keywords Review Default Data': '关键词审核默认数据',
  AI: 'AI',
  'Please Enter Title!': '请输入名称！',
  'Please Select Inspection Type!': '请选择审核类型！',
  'Please Select NSFW Keywords!': '请选择敏感词表！',
  'Please Select NSFW Scan!': '请选择敏感检测！',
  'Please Select Title Reivew Default Data': '请选择标题审核默认数据！',
  'Please Select Keywords Review Default Data': '请选择关键词审核默认数据！',

  'Please Enter Distribution Editor!': '请选择/输入分配对象！',

  'Photo Info/EXIF': '图片详情',
  Headline: '标题',
  Keywords: '关键词',
  User: '用户',
  Previous: '上一个',
  Next: '下一个',

  Model: '机型',
  'Shooting Date': '原始日期时间',
  'Edited Date': '修改时间',
  'Edited Program': '修改程序',
  'Exposure Mode': '曝光模式',
  'Focal Length': '焦距',
  Flash: '闪光灯',
  'Metering Mode': '测光模式',
  'White Balance': '白平衡',
  Resolution: '分辨率',
  Dimensions: '尺寸',
  'Color Space': '色彩空间',
  Size: '大小',
  Sensitivity: '感光度',
  'Shutter Speed': '快门速度',
  Aperture: '光圈值',
  Brand: '相机制造商',
  Lens: '镜头'
};

const exp = {
  ...menuPart,
  ...selectPart,
  ...otherPart,
  ...table
};

export const zhCNMap = options.map(exp);

export default { ...component, ...image, ...keywords, ...system, ...exp };
