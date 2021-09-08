import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import GuestLayout from 'src/layouts/GuestLayout';
import MainLayout from 'src/layouts/MainLayout';
import Login from 'src/pages/auth/Login';
import PageNotFound from 'src/pages/errors/PageNotFound';
import ServerError from 'src/pages/errors/ServerError';
import { RouteLayout } from 'src/components/router/RouteLayout';
// import Home from 'src/pages/home';
// 数据分配
import SouceList from 'src/pages/source/list';
import SourceImageText from 'src/pages/source/image-text';
import SourceImageKeyword from 'src/pages/source/image-keyword';
import SourceImageSensitive from 'src/pages/source/image-sensitive';
// 全部资源
import SystemReviewImageText from 'src/pages/system-review/image-text';
import SystemReviewImageKeyword from 'src/pages/system-review/image-keyword';
import SystemReviewImageSensitive from 'src/pages/system-review/image-sensitive';

// 我的审核
import UserReviewImageText from 'src/pages/user-review/image-text';
import UserReviewImageKeyword from 'src/pages/user-review/image-keyword';
import UserReviewImageSensitive from 'src/pages/user-review/image-sensitive';
// 终审
import ReviewResultImageText from 'src/pages/review-result/image-text';
import ReviewResultImageKeyword from 'src/pages/review-result/image-keyword';
import ReviewResultImageSensitive from 'src/pages/review-result/image-sensitive';
// 统计
import StatisticalList from 'src/pages/statistical/list';
// 帮助
import HelpList from 'src/pages/help/list';
import ImageFull from 'src/pages/image/image-full';
import ImageLicense from 'src/pages/image/license';

import { PATH } from './path';

export const RootRouter = React.memo(() => {
  return (
    <Switch>
      <Redirect path="/" to={PATH.SOURCE_IMAGE_TEXT} exact />
      <RouteLayout path={PATH.LOGIN} component={Login} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path={PATH.SOURCE_LIST} component={SouceList} layout={MainLayout} exact />
      <RouteLayout path={PATH.SOURCE_IMAGE_TEXT} component={SourceImageText} layout={MainLayout} exact />
      <RouteLayout path={PATH.SOURCE_IMAGE_KEYWORD} component={SourceImageKeyword} layout={MainLayout} exact />
      <RouteLayout
        path={PATH.SOURCE_IMAGE_SENSITIVE}
        component={SourceImageSensitive}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_IMAGE_TEXT}
        component={SystemReviewImageText}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_IMAGE_KEYWORD}
        component={SystemReviewImageKeyword}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_IMAGE_SENSITIVE}
        component={SystemReviewImageSensitive}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.USER_REVIEW_IMAGE_TEXT}
        component={UserReviewImageText}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.USER_REVIEW_IMAGE_KEYWORD}
        component={UserReviewImageKeyword}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.USER_REVIEW_IMAGE_SENSITIVE}
        component={UserReviewImageSensitive}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.REVIEW_RESULT_IMAGE_TEXT}
        component={ReviewResultImageText}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.REVIEW_RESULT_IMAGE_KEYWORD}
        component={ReviewResultImageKeyword}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.REVIEW_RESULT_IMAGE_SENSITIVE}
        component={ReviewResultImageSensitive}
        layout={MainLayout}
        exact
      />
      <RouteLayout path={PATH.STATISTICAL_LIST} component={StatisticalList} layout={MainLayout} exact />
      <RouteLayout path={PATH.HELP_LIST} component={HelpList} layout={MainLayout} exact />
      <RouteLayout path={PATH.IMAGE_FULL} component={ImageFull} layout={GuestLayout} exact />
      <RouteLayout path={PATH.IMAGE_LICENSE} component={ImageLicense} layout={GuestLayout} exact />
      <RouteLayout path={PATH.PAGE_404} component={PageNotFound} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path={PATH.PAGE_500} component={ServerError} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path="*" component={PageNotFound} layout={GuestLayout} isPrivate={false} exact />
    </Switch>
  );
});
