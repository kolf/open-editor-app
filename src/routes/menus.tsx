import { FormattedMessage } from 'react-intl';
import { PATH } from './path';

export interface Menu {
  key: string;
  name: string | React.ReactElement;
  hasChild?: boolean;
  icon?: string;
  path?: string;
  hidden?: boolean;
  children?: Menu[];
}

export const menus: Menu[] = [
  {
    key: '_SOURCE',
    // name: '数据分配',
    name: <FormattedMessage id="Data Distribution" />,
    hasChild: true,
    path: PATH.SOURCE_IMAGE_TEXT,
    children: [
      {
        key: PATH.SOURCE_LIST,
        // name: '数据来源管理',
        name: <FormattedMessage id="Source Management" />,
        icon: 'icon-data',
        path: PATH.SOURCE_LIST,
        hidden: false
      },
      {
        key: '_SOURCE_IMAGE',
        // name: '图片数据分配',
        name: <FormattedMessage id="Photo Distribution" />,
        hasChild: true,
        icon: 'icon-ic_image',
        children: [
          {
            key: PATH.SOURCE_IMAGE_TEXT,
            // name: '质量审核',
            name: <FormattedMessage id="Quality Review" />,
            hasChild: true,
            path: PATH.SOURCE_IMAGE_TEXT
          },
          {
            key: PATH.SOURCE_IMAGE_KEYWORD,
            // name: '关键词审核',
            name: <FormattedMessage id="Metadata Review" />,
            hasChild: true,
            path: PATH.SOURCE_IMAGE_KEYWORD,
            hidden: false
          },
          {
            key: PATH.SOURCE_IMAGE_SENSITIVE,
            name: '安全审核',
            hasChild: true,
            path: PATH.SOURCE_IMAGE_SENSITIVE,
            hidden: true
          }
        ]
      }
    ]
  },
  {
    key: '_SYSTEM_REVIEW',
    // name: '全部资源',
    name: <FormattedMessage id="All Resources" />,
    hasChild: true,
    path: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
    children: [
      {
        key: '_SYSTEM_REVIEW_IMAGE',
        name: <FormattedMessage id="Photo Review" />,
        hasChild: true,
        icon: 'icon-ic_image',
        children: [
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_TEXT,
            name: <FormattedMessage id="Quality Review" />,
            path: PATH.SYSTEM_REVIEW_IMAGE_TEXT
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_KEYWORD,
            name: <FormattedMessage id="Metadata Review" />,
            path: PATH.SYSTEM_REVIEW_IMAGE_KEYWORD
          },
          {
            key: PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE,
            name: '安全审核',
            path: PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE,
            hidden: true
          }
        ]
      }
    ]
  },
  {
    key: '_USER_REVIEW',
    // name: '我的审核',
    name: <FormattedMessage id="My Tasks" />,
    hasChild: true,
    path: PATH.USER_REVIEW_IMAGE_TEXT,
    children: [
      {
        key: '_USER_REVIEW_IMAGE',
        name: <FormattedMessage id="menu.image.review" />,
        hasChild: true,
        icon: 'icon-ic_image',
        children: [
          {
            key: PATH.USER_REVIEW_IMAGE_TEXT,
            name: <FormattedMessage id="menu.image.quality" />,
            path: PATH.USER_REVIEW_IMAGE_TEXT
          },
          {
            key: PATH.USER_REVIEW_IMAGE_KEYWORD,
            name: <FormattedMessage id="menu.image.keywords" />,
            path: PATH.USER_REVIEW_IMAGE_KEYWORD
          },
          {
            key: PATH.USER_REVIEW_IMAGE_SENSITIVE,
            name: '安全审核',
            path: PATH.USER_REVIEW_IMAGE_SENSITIVE,
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
    hidden: true,
    children: [
      {
        key: '_REVIEW_RESULT_IMAGE',
        name: '图片审核',
        hasChild: true,
        icon: 'icon-ic_image',
        children: [
          {
            key: PATH.REVIEW_RESULT_IMAGE_TEXT,
            name: '质量审核',
            path: PATH.REVIEW_RESULT_IMAGE_TEXT
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_KEYWORD,
            name: '关键词审核',
            path: PATH.REVIEW_RESULT_IMAGE_KEYWORD
          },
          {
            key: PATH.REVIEW_RESULT_IMAGE_SENSITIVE,
            name: '安全审核',
            path: PATH.REVIEW_RESULT_IMAGE_SENSITIVE
          }
        ]
      }
    ]
  },
  {
    key: '_STATISTIC',
    // name: '数据统计',
    name: <FormattedMessage id="Stats" />,
    hasChild: true,
    path: PATH.STATISTICAL_LIST,
    children: [
      {
        key: PATH.STATISTICAL_LIST,
        name: '数据审核统计',
        path: PATH.STATISTICAL_LIST
      }
    ]
  },
  {
    key: '_HELP',
    name: '帮助',
    hasChild: true,
    path: PATH.HELP_LIST,
    hidden: true,
    children: [
      {
        key: PATH.HELP_LIST,
        name: '帮助文档',
        path: PATH.HELP_LIST
      }
    ]
  }
];
