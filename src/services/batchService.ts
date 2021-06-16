import Api from './config';

export class BatchService {
  async getList(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiBatch/pageList`, data);
    return res.data.data;
  }
}

const bacthService = new BatchService();

export default bacthService;
