interface Params {
  [key: string]: string;
}

export class PATH {
  static replaceParams(route: string, params: Params = {}) {
    let finalRoute = route;
    Object.keys(params).forEach(key => {
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
  static SOURCE_IMAGE_TEXT = '/source/image/text';
  static SOURCE_IMAGE_KEYWORD = '/source/image/keyword';
  static SOURCE_IMAGE_SENSITIVE = '/source/image/sensitive';

  static SOURCE_VIDEO_TEXT = '/source/video/text';
  static SOURCE_VIDEO_KEYWORD = '/source/video/keyword';
  static SOURCE_VIDEO_SENSITIVE = '/source/video/sensitive';

  // 系统审核（全部资源）
  static SYSTEM_REVIEW_IMAGE_TEXT = '/system-review/image/text';
  static SYSTEM_REVIEW_IMAGE_KEYWORD = '/system-review/image/keyword';
  static SYSTEM_REVIEW_IMAGE_SENSITIVE = '/system-review/image/sensitive';

  static SYSTEM_REVIEW_VIDEO_TEXT = '/system-review/video/text';
  static SYSTEM_REVIEW_VIDEO_KEYWORD = '/system-review/video/keyword';
  static SYSTEM_REVIEW_VIDEO_SENSITIVE = '/system-review/video/sensitive';
  // 用户审核（我的审核）
  static USER_REVIEW_IMAGE_TEXT = '/user-review/image/text';
  static USER_REVIEW_IMAGE_KEYWORD = '/user-review/image/keyword';
  static USER_REVIEW_IMAGE_SENSITIVE = '/user-review/image/sensitive';

  static USER_REVIEW_VIDEO_TEXT = '/user-review/video/text';
  static USER_REVIEW_VIDEO_KEYWORD = '/user-review/video/keyword';
  static USER_REVIEW_VIDEO_SENSITIVE = '/user-review/video/sensitive';
  // 终审
  static REVIEW_RESULT_IMAGE_TEXT = '/review-result/image/text';
  static REVIEW_RESULT_IMAGE_KEYWORD = '/review-result/image/keyword';
  static REVIEW_RESULT_IMAGE_SENSITIVE = '/review-result/image/sensitive';

  static REVIEW_RESULT_VIDEO_TEXT = '/review-result/video/text';
  static REVIEW_RESULT_VIDEO_KEYWORD = '/review-result/video/keyword';
  static REVIEW_RESULT_VIDEO_SENSITIVE = '/review-result/video/sensitive';

  // 数据统计
  static STATISTICAL_LIST = '/statistical/list';
  // 帮助
  static HELP_LIST = '/help/list';
  // 查看原图
  static IMAGE_FULL = '/image/full/:imageId';
  // 查看授权文件
  static IMAGE_LICENSE = '/image/license';
}
