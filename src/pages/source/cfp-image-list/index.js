import React from 'react';
import Layout from 'layouts/BasicLayout';

import List from './List';

async function action({ path, fetch }) {
  return {
    chunks: ['source_vcg-image-text'],
    title: '创意类图片审核-数据来源',
    component: (
      <Layout path={path}>
        <List fetch={fetch} />
      </Layout>
    ),
  };
}

export default action;
