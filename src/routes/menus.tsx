import { FormattedMessage } from 'react-intl';
import { PATH } from './path';

export const menus: Menu[] = [
  {
    key: '_SOURCE',
    // name: '数据分配',
    name: <FormattedMessage id='Data Distribution'/>,
    hasChild: true,
    path: PATH.SOURCE_IMAGE_TEXT,
    breadcrumbName: '数据分配',
    children: [
      {
        key: PATH.SOURCE_LIST,
        // name: '数据来源管理',
        name: <FormattedMessage id='Source Management'/>,
        icon: 'icon-data',
        path: PATH.SOURCE_LIST,
        breadcrumbName: '数据来源管理',
        hidden: false,
      },
      {
        key: '_SOURCE_IMAGE',
        // name: '图片数据分配',
        name: <FormattedMessage id='Photo Distribution'/>,
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片数据分配',
        children: [
          {
            key: PATH.SOURCE_IMAGE_TEXT,
            // name: '质量审核',
            name: <FormattedMessage id='Quality Review'/>,
            hasChild: true,
            path: PATH.SOURCE_IMAGE_TEXT,
            breadcrumbName: '质量审核'
          },
          {
            key: PATH.SOURCE_IMAGE_KEYWORD,
            // name: '关键词审核',
            name: <FormattedMessage id='Metadata Review'/>,
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
          }
        ]
      }
    ]
  },
  {
    key: '_SYSTEM_REVIEW',
    // name: '全部资源',
    name: <FormattedMessage id='All Resources'/>,
    hasChild: true,
    path: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
    breadcrumbName: '全部资源',
    children: [
      {
        key: '_SYSTEM_REVIEW_IMAGE',
        name: '图片审核',
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片审核',
        children: [
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
            name: '质量审核',
            path: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
            breadcrumbName: '质量审核'
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_KEYWORD,
            name: '关键词审核',
            path: PATH.SYSTEM_REVIEW_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核'
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE,
            name: '安全审核',
            path: PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    key: '_USER_REVIEW',
    // name: '我的审核',
    name: <FormattedMessage id='My Tasks'/>,
    hasChild: true,
    path: PATH.USER_REVIEW_IMAGE_TEXT,
    breadcrumbName: '我的审核',
    children: [
      {
        key: '_USER_REVIEW_IMAGE',
        name: '图片审核',
        hasChild: true,
        icon: 'icon-ic_image',
        breadcrumbName: '图片审核',
        children: [
          {
            key: PATH.USER_REVIEW_IMAGE_TEXT,
            name: '质量审核',
            path: PATH.USER_REVIEW_IMAGE_TEXT,
            breadcrumbName: '质量审核'
          },
          {
            key: PATH.USER_REVIEW_IMAGE_KEYWORD,
            name: '关键词审核',
            path: PATH.USER_REVIEW_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核'
          },
          {
            key: PATH.USER_REVIEW_IMAGE_SENSITIVE,
            name: '安全审核',
            path: PATH.USER_REVIEW_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核',
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
        children: [
          {
            key: PATH.REVIEW_RESULT_IMAGE_TEXT,
            name: '质量审核',

            path: PATH.REVIEW_RESULT_IMAGE_TEXT,
            breadcrumbName: '质量审核'
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_KEYWORD,
            name: '关键词审核',

            path: PATH.REVIEW_RESULT_IMAGE_KEYWORD,
            breadcrumbName: '关键词审核'
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_SENSITIVE,
            name: '安全审核',

            path: PATH.REVIEW_RESULT_IMAGE_SENSITIVE,
            breadcrumbName: '安全审核'
          }
        ]
      }
    ]
  },
  {
    key: '_STATISTIC',
    // name: '数据统计',
    name: <FormattedMessage id='Stats'/>,
    hasChild: true,
    path: PATH.STATISTICAL_LIST,
    breadcrumbName: '数据统计',
    children: [
      {
        key: PATH.STATISTICAL_LIST,
        name: '数据审核统计',

        path: PATH.STATISTICAL_LIST,
        breadcrumbName: '数据审核统计'
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

        path: PATH.HELP_LIST,
        breadcrumbName: '帮助文档'
      }
    ]
  }
];
