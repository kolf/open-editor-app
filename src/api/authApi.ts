import Api from './config';

export class AuthService {
  async me() {
    return this.getUser('me');
  }

  async login(user: any) {
    try {
      const res1 = await this.checkToken(user);
      const res2 = await this.getUser('d');
      console.log(res1, res2, 'res');
      return Promise.resolve(res2);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkToken(user: any) {
    return await Api.post('/api/passport/vcglogin/access', user);
  }

  async getUser(token: string) {
    return await Api.get(`/api/editor/user/viewByToken?token=${token}`);
  }
}

const authService = new AuthService();

export default authService;
