import Api from './config';
import { getToken } from 'src/utils/localStorage';

export class AuthService {
  async me() {
    const token = getToken();
    if (token) {
      return this.getUser(token);
    }
    return Promise.reject(new Error(`token过期`));
  }

  async login(user: any) {
    try {
      const res1 = await this.getTGT(user);
      const res2 = await this.getUser(res1.data.TGT);
      return Promise.resolve<any>({
        token: res1.data.TGT,
        user: res2.data.data,
      });
    } catch (error) {
      return Promise.reject(new Error(`用户名或密码错误！`));
    }
  }

  async getTGT(user: any): Promise<any> {
    return await Api.post('/api/passport/vcglogin/access', user);
  }

  async getUser(token: string): Promise<any> {
    return await Api.get(`/api/editor/user/viewByToken?token=${token}`);
  }
}

const authService = new AuthService();

export default authService;
