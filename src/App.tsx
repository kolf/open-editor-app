import { Spin } from 'antd';
import React, { Suspense } from 'react';
import './App.less';
import { RootRouter } from './routes/index';

function App() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <RootRouter />
    </Suspense>
  );
}

export default App;
