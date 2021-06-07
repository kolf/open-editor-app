import { PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import React from 'react';
import { PATH } from 'src/routes/path';

export const menus = [
  {
    key: PATH.SOURCE_LIST,
    name: '图片数据分配',
    hasChild: true,
    icon: <DesktopOutlined />,
    path: PATH.SOURCE_VCG_IMAGE_TEXT,
    breadcrumbName: '图片数据分配',
    hidden: false,
    children: [
      {
        key: PATH.SOURCE_VCG_IMAGE_TEXT,
        name: '创意类质量审核',
        hasChild: true,
        path: PATH.SOURCE_VCG_IMAGE_TEXT,
        breadcrumbName: '创意类质量审核',
        hidden: false,
      },
      {
        key: PATH.SOURCE_VCG_IMAGE_KEYWOR,
        name: '创意类关键词审核',
        hasChild: true,
        path: PATH.SOURCE_VCG_IMAGE_KEYWOR,
        breadcrumbName: '创意类关键词审核',
        hidden: false,
      },
    ],
  },
];
