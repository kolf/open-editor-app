import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Spin } from 'antd';
import { RootRouter } from './routes/index';
import { setShow } from 'src/features/search/search';

import './App.less';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(location => {
      dispatch(setShow(false));
    });
  }, []);

  return (
    <Suspense fallback={<Spin size="large" />}>
      <RootRouter />
    </Suspense>
  );
}

export default App;
