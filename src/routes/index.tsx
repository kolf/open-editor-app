import React from 'react';
import { Switch } from 'react-router-dom';
import GuestLayout from 'src/layouts/GuestLayout';
import MainLayout from 'src/layouts/MainLayout';
import Login from 'src/pages/auth/Login';
import PageNotFound from 'src/pages/errors/PageNotFound';
import ServerError from 'src/pages/errors/ServerError';
import { RouteLayout } from 'src/components/router/RouteLayout';
import Home from 'src/pages/home';
// 数据分配
import SouceList from 'src/pages/source/list';
import SourceVcgImageText from 'src/pages/source/vcg-image-text';
import SourceVcgImageKeyword from 'src/pages/source/vcg-image-keyword';
import SourceVcgImageSensitive from 'src/pages/source/vcg-image-sensitive';
import SourceCfpImageList from 'src/pages/source/cfp-image-list';
// 全部资源
import SystemReviewVcgImageText from 'src/pages/system-review/vcg-image-text';
import SystemReviewVcgImageKeyword from 'src/pages/system-review/vcg-image-keyword';
import SystemReviewVcgImageSensitive from 'src/pages/system-review/vcg-image-sensitive';
import SystemReviewCfpImageList from 'src/pages/system-review/cfp-image-list';
// 我的审核
import UserReviewVcgImageText from 'src/pages/user-review/vcg-image-text';
import UserReviewVcgImageKeyword from 'src/pages/user-review/vcg-image-keyword';
import UserReviewVcgImageSensitive from 'src/pages/user-review/vcg-image-sensitive';
import UserReviewCfpImageList from 'src/pages/user-review/cfp-image-list';
// 终审
import ReviewResultVcgImageText from 'src/pages/review-result/vcg-image-text';
import ReviewResultVcgImageKeyword from 'src/pages/review-result/vcg-image-keyword';
import ReviewResultVcgImageSensitive from 'src/pages/review-result/vcg-image-sensitive';
import ReviewResultCfpImageList from 'src/pages/review-result/cfp-image-list';
// 统计
import statisticalList from 'src/pages/statistical/list';
// 帮助
import HelpList from 'src/pages/help/list';

import { PATH } from './path';

export const RootRouter = React.memo(() => {
  return (
    <Switch>
      <RouteLayout path={PATH.LOGIN} component={Login} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path={PATH.HOME} component={Home} layout={MainLayout} exact />
      <RouteLayout path={PATH.SOURCE_LIST} component={SouceList} layout={MainLayout} exact />
      <RouteLayout path={PATH.SOURCE_VCG_IMAGE_TEXT} component={SourceVcgImageText} layout={MainLayout} exact />
      <RouteLayout path={PATH.SOURCE_VCG_IMAGE_KEYWORD} component={SourceVcgImageKeyword} layout={MainLayout} exact />
      <RouteLayout
        path={PATH.SOURCE_VCG_IMAGE_SENSITIVE}
        component={SourceVcgImageSensitive}
        layout={MainLayout}
        exact
      />
      <RouteLayout path={PATH.SOURCE_CFP_IMAGE_LIST} component={SourceCfpImageList} layout={MainLayout} exact />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_VCG_IMAGE_TEXT}
        component={SystemReviewVcgImageText}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_VCG_IMAGE_KEYWORD}
        component={SystemReviewVcgImageKeyword}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_VCG_IMAGE_SENSITIVE}
        component={SystemReviewVcgImageSensitive}
        layout={MainLayout}
        exact
      />
      <RouteLayout
        path={PATH.SYSTEM_REVIEW_CFP_IMAGE_LIST}
        component={SystemReviewCfpImageList}
        layout={MainLayout}
        exact
      />
      <RouteLayout path={PATH.PAGE_404} component={PageNotFound} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path={PATH.PAGE_500} component={ServerError} layout={GuestLayout} isPrivate={false} exact />
      <RouteLayout path="*" component={PageNotFound} layout={GuestLayout} isPrivate={false} exact />
    </Switch>
  );
});
