import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import { PATH } from 'src/routes/path';
import './styles.less';

function PageNotFound() {
  const history = useHistory();
  return (
    <div className="main">
      <Result
        status="404"
        title="404"
        subTitle="对不起，页面不存在，请检测URL"
        extra={
          <Button type="primary" onClick={() => history.push(PATH.HOME)}>
            返回首页
          </Button>
        }
      />
    </div>
  );
}

export default PageNotFound;
