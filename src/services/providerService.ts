import Api from './config';

export class ProviderService {
  async getList(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/OsiDbProvider/pageList`, data);
    return res.data;
  }
}

const providerService = new ProviderService();

export default providerService;
