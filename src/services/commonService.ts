import Api from './config';

export class CommonService {
  async getUser(token: string): Promise<any> {
    return await Api.get(`/api/editor/user/viewByToken?token=${token}`);
  }
}

const commonService = new CommonService();

export default commonService;
