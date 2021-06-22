import Api from './config';
import { getToken } from 'src/utils/localStorage';

export class AuthService {
  async me() {
    const token = getToken();
    if (token) {
      const res = await this.getUser(token);
      if (res.data.code !== 200) {
        return Promise.reject(res.data.message)
      }
      return res.data
    }
    return Promise.reject(new Error(`token过期`));
  }

  async login(user: any) {
    try {
      const res1 = await this.getTGT(user);
      if (res1.data.status !== '200') {
        throw res1.data.status;
      }
      const res2 = await this.getUser(res1.data.TGT);
      if (res2.data.code !== 200) {
        throw res1.data.status;
      }
      return Promise.resolve<any>({
        token: res1.data.TGT,
        user: res2.data.data
      });
    } catch (error) {
      return Promise.reject(new Error(`用户名或密码错误！`));
    }
  }

  getTGT(user: any): Promise<any> {
    return Api.post('/api/passport/vcglogin/access', user);
  }

  getUser(token: string): Promise<any> {
    return Api.get(`/api/editor/user/viewByToken?token=${token}`);
  }

  modifyPassword(data: { ucId: string, newPassword: string }) {
    return Api.post(`/api/editor/user/modifyPwd`, data);
  }
}

const authService = new AuthService();

export default authService;
