import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Spin } from 'antd';
import { RootRouter } from './routes/index';
import { setShow, setKeywords } from 'src/features/search/search';

import './App.less';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const ref = useRef(null);

  useEffect(() => {
    history.listen(location => {
      if (!ref.current) {
        ref.current = location.pathname;
      }
      if (ref.current !== location.pathname) {
        ref.current = location.pathname;
        dispatch(setShow(false));
        dispatch(setKeywords(''));
      }
    });
  }, [ref]);

  return (
    <Suspense fallback={<Spin size="large" />}>
      <RootRouter />
    </Suspense>
  );
}

export default App;
