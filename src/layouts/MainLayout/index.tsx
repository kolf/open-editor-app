import { BackTop, Col, Layout, Row } from 'antd';
import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'src/components/common/Loading';
import { getMe } from 'src/features/auth/authenticate';
import { setIsCollapsed } from 'src/features/collapsedMenu/collapsedMenu';
import { RootState } from 'src/store';
import { menus } from 'src/routes/menus';
import BreadcrumbMenu from './Breadcrumb';
import AppHeader from './Header';
import MenuLink from './MenuLink';

const { Header, Content, Sider } = Layout;
type Props = {
  children: React.ReactNode;
};

const MainLayout: FC<Props> = (props) => {
  const collapsed = useSelector((state: RootState) => state.collapsed.isCollapsed);
  const user = useSelector((state: RootState) => state.user.user);
  const [menuKey, setMenuKey] = useState(menus[0].key);
  const loading = useSelector((state: RootState) => state.user.loading);
  const dispatch = useDispatch();

  const handleCollapse = () => {
    dispatch(setIsCollapsed());
  };

  const handleMenuChange = (e: any) => {
    setMenuKey(e.key);
  };

  useEffect(() => {
    if (!user) dispatch(getMe());
  }, [user]);

  if (loading || !user) return <Loading />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="site-layout-header site-layout-background">
        <AppHeader menuKey={menuKey} onChange={handleMenuChange} />
      </Header>
      <Layout>
        <Sider className="site-layout-sidebar" collapsible collapsed={collapsed} onCollapse={handleCollapse}>
          <MenuLink menuKey={menuKey} />
        </Sider>
        <Layout className="site-layout-main">
          <Content style={{ margin: '0 16px' }}>
            <div className="breadcrumbMenu">
              <Row>
                <Col xs={0} sm={24} span={24}>
                  <BreadcrumbMenu />
                </Col>
              </Row>
            </div>
            <div className="site-layout-background site-layout-content">{props.children}</div>
          </Content>
        </Layout>
        <BackTop />
      </Layout>
    </Layout>
  );
};

export default memo(MainLayout);
