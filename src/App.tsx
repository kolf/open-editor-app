import React, { useEffect, Suspense, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ConfigProvider, Spin } from 'antd';
import { RootRouter } from './routes/index';
import { setShow, setKeywords } from 'src/features/search/search';
import './App.less';
import { IntlProvider } from 'react-intl';
import { useLanguagePkg } from './hooks/useLanguage';

function App() {
  const { language, languagePkg } = useLanguagePkg();
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
      <ConfigProvider locale={languagePkg}>
        <IntlProvider locale={language} messages={languagePkg}>
          <RootRouter />
        </IntlProvider>
      </ConfigProvider>
    </Suspense>
  );
}

export default App;
