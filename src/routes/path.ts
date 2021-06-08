interface Params {
  [key: string]: string;
}

export class PATH {
  static replaceParams(route: string, params: Params = {}) {
    let finalRoute = route;
    Object.keys(params).forEach((key) => {
      finalRoute = finalRoute.replace(`:${key}`, params[key]);
    });
    return finalRoute;
  }

  static HOME = '/';
  static PROFILE = '/users/profile';
  static LOGIN = '/login';
  static PAGE_404 = '/404';
  static PAGE_500 = '/500';

  // 数据分配
  static SOURCE_LIST = '/source/list';
  static SOURCE_VCG_IMAGE_TEXT = '/source/vcg-image/text';
  static SOURCE_VCG_IMAGE_KEYWORD = '/source/vcg-image/keyword';
  static SOURCE_VCG_IMAGE_SENSITIVE = '/source/vcg-image/sensitive';
  static SOURCE_CFP_IMAGE_LIST = '/source/cfp-image/list';
  static SOURCE_VCG_VIDEO_TEXT = '/source/vcg-video/text';
  static SOURCE_VCG_VIDEO_KEYWORD = '/source/vcg-video/keyword';
  static SOURCE_VCG_VIDEO_SENSITIVE = '/source/vcg-video/sensitive';
  static SOURCE_CFP_VIDEO_LIST = '/source/cfp-video/list';
  // 系统审核（全部资源）
  static SYSTEM_REVIEW_VCG_IMAGE_TEXT = '/system-review/vcg-image/text';
  static SYSTEM_REVIEW_VCG_IMAGE_KEYWORD = '/system-review/vcg-image/keyword';
  static SYSTEM_REVIEW_VCG_IMAGE_SENSITIVE = '/system-review/vcg-image/sensitive';
  static SYSTEM_REVIEW_CFP_IMAGE_LIST = '/system-review/cfp-image/list';
  static SYSTEM_REVIEW_VCG_VIDEO_TEXT = '/system-review/vcg-video/text';
  static SYSTEM_REVIEW_VCG_VIDEO_KEYWORD = '/system-review/vcg-video/keyword';
  static SYSTEM_REVIEW_VCG_VIDEO_SENSITIVE = '/system-review/vcg-video/sensitive';
  static SYSTEM_REVIEW_CFP_VIDEO_LIST = '/system-review/cfp-video/list';
  // 用户审核（我的审核）
  static USER_REVIEW_VCG_IMAGE_TEXT = '/user-review/vcg-image/text';
  static USER_REVIEW_VCG_IMAGE_KEYWORD = '/user-review/vcg-image/keyword';
  static USER_REVIEW_VCG_IMAGE_SENSITIVE = '/user-review/vcg-image/sensitive';
  static USER_REVIEW_CFP_IMAGE_LIST = '/user-review/cfp-image/list';
  static USER_REVIEW_VCG_VIDEO_TEXT = '/user-review/vcg-video/text';
  static USER_REVIEW_VCG_VIDEO_KEYWORD = '/user-review/vcg-video/keyword';
  static USER_REVIEW_VCG_VIDEO_SENSITIVE = '/user-review/vcg-video/sensitive';
  static USER_REVIEW_CFP_VIDEO_LIST = '/user-review/cfp-video/list';
  // 终审
  static REVIEW_RESULT_VCG_IMAGE_TEXT = '/review-result/vcg-image/text';
  static REVIEW_RESULT_VCG_IMAGE_KEYWORD = '/review-result/vcg-image/keyword';
  static REVIEW_RESULT_VCG_IMAGE_SENSITIVE = '/review-result/vcg-image/sensitive';
  static REVIEW_RESULT_CFP_IMAGE_LIST = '/review-result/cfp-image/list';
  static REVIEW_RESULT_VCG_VIDEO_TEXT = '/review-result/vcg-video/text';
  static REVIEW_RESULT_VCG_VIDEO_KEYWORD = '/review-result/vcg-video/keyword';
  static REVIEW_RESULT_VCG_VIDEO_SENSITIVE = '/review-result/vcg-video/sensitive';
  static REVIEW_RESULT_CFP_VIDEO_LIST = '/review-result/cfp-video/list';
  // 数据统计
  static STATISTICAL_LIST = '/statistical/list';
  // 帮助
  static HELP_LIST = '/help/list';
}
