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
  static USER_MANAGEMENT = '/users';
  static ABOUT = '/users/about';
  static PROFILE = '/users/profile';
  static LOGIN = '/login';
  static PAGE_404 = '/404';
  static PAGE_500 = '/500';

  static SOURCE_LIST = '/source/list';
  static SOURCE_VCG_IMAGE_TEXT = '/source/vcg-image/text';
  static SOURCE_VCG_IMAGE_KEYWOR = '/source/vcg-image/keyword';
  static SOURCE_VCG_IMAGE_SENSITIVE = '/source/vcg-image/sensitive';
  static SOURCE_CFP_IMAGE_LIST = '/source/cfp-image/list';
  static SOURCE_VCG_VIDEO_TEXT = '/source/vcg-video/text';
  static SOURCE_VCG_VIDEO_KEYWOR = '/source/vcg-video/keyword';
  static SOURCE_VCG_VIDEO_SENSITIVE = '/source/vcg-video/sensitive';
  static SOURCE_CFP_VIDEO_LIST = '/source/cfp-video/list';
}
