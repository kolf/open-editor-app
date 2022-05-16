import Api from './config';
import { getToken } from 'src/utils/localStorage';

export class AuthService {
  async me() {
    const token = getToken();
    if (token) {
      const res = await this.getUser(token);
      if (!res.data.success) {
        return Promise.reject(res.data.errMessage);
      }
      return res.data;
    }
    return Promise.reject(new Error(`token过期`));
  }

  async login(user: any) {
    try {
      const res1 = await this.getTGT(user);
      if (!res1.data.success) {
        throw res1.data.errMessage;
      }

      const newToken = res1.data.data;

      const res2 = await this.getUser(newToken);
      if (!res2.data.success) {
        throw res2.data.errMessage;
      }
      const userInfo = res2.data.data;

      const res3 = await this.getMenus(newToken);
      if (!res3.data.success) {
        throw res3.data.errMessage;
      }
      const menus = res3.data.data;

      const res4 = await this.getPermissons(newToken);
      if (!res4.data.success) {
        throw res4.data.errMessage;
      }
      const permissons = res4.data.data;

      return Promise.resolve<any>({
        token: newToken,
        user: userInfo,
        menus,
        permissons
      });
    } catch (error) {
      return Promise.reject(new Error(`用户名或密码错误！`));
    }
  }

  getTGT(user: any): Promise<any> {
    return Api.post('/api/boss3/v3/passport/login', {
      username: user.userName,
      password: user.password,
      systemCode: 'EDIT_OPEN_SYSTEM'
    });
  }

  getUser(token: string): Promise<any> {
    return Api.get(`/api/boss3/v3/passport/retrieve_user_from_token`, {
      headers: { token }
    });
  }

  getMenus(token: string): Promise<any> {
    return Api.get(`/api/boss3/v3/passport/menus`, {
      headers: { token }
    });
  }

  getPermissons(token: string): Promise<any> {
    return Api.get(`/api/boss3/v3/passport/permission`, {
      headers: { token }
    });
  }

  modifyPassword(data: { oldPassword: string; newPassword: string }) {
    return Api.post(`/api/boss3/v3/passport/modify_pwd`, data);
  }
}

const authService = new AuthService();

export default authService;
