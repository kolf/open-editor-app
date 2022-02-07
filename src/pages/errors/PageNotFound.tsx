import { Button, Result } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import './styles.less';
import { getFirstChild } from 'src/utils/tools';

const PageNotFound: React.FC = () => {
  const { formatMessage } = useIntl();
  const history = useHistory();
  const menus = useSelector((state: any) => state.user.menus);
  const indexPath = getFirstChild(menus).path;

  return (
    <div className="main">
      <Result
        status="404"
        title="404"
        subTitle={formatMessage({ id: 'page.notFound' })}
        extra={
          <Button type="primary" onClick={() => history.push(indexPath)}>

            {formatMessage({ id: 'page.goHome' })}
          </Button>
        }
      />
    </div>
  );
}

export default PageNotFound;
