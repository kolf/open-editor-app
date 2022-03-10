import { BackTop, Col, Layout, Row } from 'antd';
import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'src/components/common/Loading';
import { DataProvider } from 'src/components/contexts/DataProvider';
import { getMe } from 'src/features/auth/authenticate';
import { setIsCollapsed } from 'src/features/collapsedMenu/collapsedMenu';
import { RootState } from 'src/store';
import MenuLink from './MenuLink';
import AppHeader from './Header';

const { Header, Content, Sider } = Layout;

type Props = {
  children: React.ReactNode;
};

function getMenukey(menus) {
  let rootKey = '',
    secondKey = '';

  function getKey(menu, rootK, secondK) {
    if (!menu.children || menu.children.length === 0) {
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
          getKey(menu.children, rootK, secondK);
        }
      });
    }
  }
  menus.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(m => getKey(m, menu.id + '', m.id + ''));
    }
  });
  return rootKey
    ? {
      rootKey,
      secondKey
    }
    : {
      rootKey: menus[0].id + '',
      secondKey: menus[0]?.children[0]?.id + ''
    };
}

const MainLayout: FC<Props> = props => {
  const collapsed = useSelector((state: RootState) => state.collapsed.isCollapsed);
  const user = useSelector((state: RootState) => state.user.user);
  const menus = useSelector((state: RootState) => state.user.menus);
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

  const getMenu = () => {
    return menus.find(menu => menu.id+'' === menuKey.rootKey)?.children || []
  }

  useEffect(() => {
    
    console.log(menus,'menus')

    if (!user){
      dispatch(getMe())
    };
  }, [user, menus]);

  if (loading || !user) return <Loading />;

  return (
    <DataProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="site-layout-header site-layout-background">
          <AppHeader menuKey={menuKey.rootKey} onChange={handleMenuChange} />
        </Header>
        <Layout style={{ paddingTop: 64 }}>
          <Sider
            className="site-layout-sidebar"
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
          >
            <MenuLink menu={getMenu()} current={menuKey.secondKey} />
          </Sider>
          <Content style={{ margin: `16px 16px 0 ${collapsed ? 96 : 216}px` }}>
            <div className="site-layout-background site-layout-content">{props.children}</div>
          </Content>
          <BackTop />
        </Layout>
      </Layout>
    </DataProvider>
  );
};

export default memo(MainLayout);
