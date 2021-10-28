import Api from './config';
import queryString from 'querystring';

export class ProviderService {
  async getList(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/OsiDbProvider/pageList?${queryString.stringify(data)}`);
    return res.data.data;
  }

  async add(data): Promise<any> {
    const res = await Api.post(`/api/outsourcing/OsiDbProvider/add`, data);
    return res.data;
  }

  async modify(id, data): Promise<any> {
    data.id = id;
    const res = await Api.post(`/api/outsourcing/OsiDbProvider/modify`, data);
    return res.data;
  }
}

const providerService = new ProviderService();

export default providerService;
