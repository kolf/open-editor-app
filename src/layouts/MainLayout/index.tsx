import { BackTop, Col, Layout, Row } from 'antd';
import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'src/components/common/Loading';
import { getMe } from 'src/features/auth/authenticate';
import { setIsCollapsed } from 'src/features/collapsedMenu/collapsedMenu';
import { RootState } from 'src/store';
import { menus } from 'src/routes/menus';
import AppHeader from './Header';
import MenuLink from './MenuLink';

const { Header, Content, Sider } = Layout;
type Props = {
  children: React.ReactNode;
};

function getMenukey(menus) {
  let rootKey = "", secondKey = "";
 
  function getKey(menu, rootK, secondK) {
    if (!menu.hasChild) {
      if (menu.path === window.location.pathname) {
        rootKey = rootK;
        secondKey = secondK;
      } 
    } else {
      menu.children.forEach(menu => {
        if (menu.path === window.location.pathname) {
          rootKey = rootK;
          secondKey = secondK;
        } 
        if (menu.children) {
          getKey(menu.children, rootK, secondK)
        }
      })
    }
    
  }
  menus.forEach(menu => {
    if (menu.hasChild) menu.children.forEach(m => getKey(m, menu.key, m.key))
  })
  return rootKey ? {
    rootKey,
    secondKey
  } : {
    rootKey: menus[0].key,
    secondKey: menus[0]?.children[0]?.key
  };
}

const MainLayout: FC<Props> = props => {
  const collapsed = useSelector((state: RootState) => state.collapsed.isCollapsed);
  const user = useSelector((state: RootState) => state.user.user);
  const [menuKey, setMenuKey] = useState(getMenukey(menus));


  const loading = useSelector((state: RootState) => state.user.loading);
  const dispatch = useDispatch();

  const handleCollapse = () => {
    dispatch(setIsCollapsed());
  };

  const handleMenuChange = (e: any) => {
    setMenuKey({
      ...getMenukey(menus),
      rootKey: e.key
    });
  };

  useEffect(() => {
    if (!user) dispatch(getMe());
  }, [user]);

  if (loading || !user) return <Loading />;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="site-layout-header site-layout-background">
        <AppHeader menuKey={menuKey.rootKey} onChange={handleMenuChange} />
      </Header>
      <Layout>
        <Sider className="site-layout-sidebar" collapsible collapsed={collapsed} onCollapse={handleCollapse}>
          <MenuLink menuKey={menuKey.rootKey} siderbarKey={ menuKey.secondKey } />
        </Sider>
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background site-layout-content">{props.children}</div>
        </Content>
        <BackTop />
      </Layout>
    </Layout>
  );
};

export default memo(MainLayout);
