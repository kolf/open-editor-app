import React from 'react';
import { Switch } from 'react-router-dom';
import GuestLayout from 'src/layouts/GuestLayout';
import MainLayout from 'src/layouts/MainLayout';
import Login from 'src/pages/auth/Login';
import PageNotFound from 'src/pages/errors/PageNotFound';
import ServerError from 'src/pages/errors/ServerError';
import { RouteLayout } from '../components/router/RouteLayout';
import Home from '../pages/home';
import SouceList from '../pages/source/list/List';
import { PATH } from './path';

export const RootRouter = React.memo(() => {
  return (
    <Switch>
      <RouteLayout path={PATH.LOGIN} component={Login} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path={PATH.HOME} component={Home} layout={MainLayout} exact />
      <RouteLayout path={PATH.SOURCE_LIST} component={SouceList} layout={MainLayout} exact />
      <RouteLayout path={PATH.PAGE_404} component={PageNotFound} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path={PATH.PAGE_500} component={ServerError} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path="*" component={PageNotFound} layout={GuestLayout} isPrivate={false} exact />
    </Switch>
  );
});
