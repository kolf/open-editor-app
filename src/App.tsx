import React, { Suspense } from 'react';

import { Spin } from 'antd';
import { RootRouter } from './routes/index';

import './App.less';

function App() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <RootRouter />
    </Suspense>
  );
}

export default App;
