import { PATH } from './path';

export const menus: Menu[] = [
  {
    key: '_SOURCE',
    name: '数据分配',
    hasChild: true,
    path: PATH.SOURCE_IMAGE_TEXT,
    breadcrumbName: '数据分配',
    hidden: false,
    children: [
      {
        key: PATH.SOURCE_LIST,
        name: '数据来源管理',
        hasChild: false,
        icon: 'icon-data',
        path: PATH.SOURCE_LIST,
        breadcrumbName: '数据来源管理',
        hidden: false,
      },
      {
        key: '_SOURCE_IMAGE',
        name: '图片数据分配',
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片数据分配',
        hidden: false,
        children: [
          {
            key: PATH.SOURCE_IMAGE_TEXT,
            name: '质量审核',
            hasChild: true,
            path: PATH.SOURCE_IMAGE_TEXT,
            breadcrumbName: '质量审核',
            hidden: false
          },
          {
            key: PATH.SOURCE_IMAGE_KEYWORD,
            name: '关键词审核',
            hasChild: true,
            path: PATH.SOURCE_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核',
            hidden: false
          },
          {
            key: PATH.SOURCE_IMAGE_SENSITIVE,
            name: '安全审核',
            hasChild: true,
            path: PATH.SOURCE_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核',
            hidden: true
          },
          {
            key: PATH.SOURCE_IMAGE_LIST,
            name: '编辑类审核',
            hasChild: true,
            path: PATH.SOURCE_IMAGE_LIST,
            breadcrumbName: '编辑类审核',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    key: '_SYSTEM_REVIEW',
    name: '全部资源',
    hasChild: true,
    path: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
    breadcrumbName: '全部资源',
    hidden: false,
    children: [
      {
        key: '_SYSTEM_REVIEW_IMAGE',
        name: '图片审核',
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片审核',
        hidden: false,
        children: [
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
            name: '质量审核',
            hasChild: false,
            path: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
            breadcrumbName: '质量审核',
            hidden: false
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_KEYWORD,
            name: '关键词审核',
            hasChild: false,
            path: PATH.SYSTEM_REVIEW_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核',
            hidden: true
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE,
            name: '安全审核',
            hasChild: false,
            path: PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核',
            hidden: true
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_LIST,
            name: '编辑类审核',
            hasChild: false,
            path: PATH.SYSTEM_REVIEW_IMAGE_LIST,
            breadcrumbName: '编辑类审核',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    key: '_USER_REVIEW',
    name: '我的审核',
    hasChild: true,
    path: PATH.USER_REVIEW_IMAGE_TEXT,
    breadcrumbName: '我的审核',
    hidden: false,
    children: [
      {
        key: '_USER_REVIEW_IMAGE',
        name: '图片审核',
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片审核',
        hidden: false,
        children: [
          {
            key: PATH.USER_REVIEW_IMAGE_TEXT,
            name: '质量审核',
            hasChild: false,
            path: PATH.USER_REVIEW_IMAGE_TEXT,
            breadcrumbName: '质量审核',
            hidden: false
          },
          {
            key: PATH.USER_REVIEW_IMAGE_KEYWORD,
            name: '关键词审核',
            hasChild: false,
            path: PATH.USER_REVIEW_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核',
            hidden: true
          },
          {
            key: PATH.USER_REVIEW_IMAGE_SENSITIVE,
            name: '安全审核',
            hasChild: false,
            path: PATH.USER_REVIEW_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核',
            hidden: true
          },
          {
            key: PATH.USER_REVIEW_IMAGE_LIST,
            name: '编辑类审核',
            hasChild: false,
            path: PATH.USER_REVIEW_IMAGE_LIST,
            breadcrumbName: '编辑类审核',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    key: '_REVIEW_RESULT',
    name: '终审',
    hasChild: true,
    path: PATH.REVIEW_RESULT_IMAGE_TEXT,
    breadcrumbName: '终审',
    hidden: true,
    children: [
      {
        key: '_REVIEW_RESULT_IMAGE',
        name: '图片审核',
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片审核',
        hidden: false,
        children: [
          {
            key: PATH.REVIEW_RESULT_IMAGE_TEXT,
            name: '质量审核',
            hasChild: false,
            path: PATH.REVIEW_RESULT_IMAGE_TEXT,
            breadcrumbName: '质量审核',
            hidden: false
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_KEYWORD,
            name: '关键词审核',
            hasChild: false,
            path: PATH.REVIEW_RESULT_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核',
            hidden: false
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_SENSITIVE,
            name: '安全审核',
            hasChild: false,
            path: PATH.REVIEW_RESULT_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核',
            hidden: false
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_LIST,
            name: '编辑类审核',
            hasChild: false,
            path: PATH.REVIEW_RESULT_IMAGE_LIST,
            breadcrumbName: '编辑类审核',
            hidden: false
          }
        ]
      }
    ]
  },
  {
    key: '_STATISTIC',
    name: '数据统计',
    hasChild: true,
    path: PATH.STATISTICAL_LIST,
    breadcrumbName: '数据统计',
    hidden: false,
    children: [
      {
        key: PATH.STATISTICAL_LIST,
        name: '数据审核统计',
        hasChild: false,
        path: PATH.STATISTICAL_LIST,
        breadcrumbName: '数据审核统计',
        hidden: false
      }
    ]
  },
  {
    key: '_HELP',
    name: '帮助',
    hasChild: true,
    path: PATH.HELP_LIST,
    breadcrumbName: '帮助',
    hidden: true,
    children: [
      {
        key: PATH.HELP_LIST,
        name: '帮助文档',
        hasChild: false,
        path: PATH.HELP_LIST,
        breadcrumbName: '帮助文档',
        hidden: false
      }
    ]
  }
];
