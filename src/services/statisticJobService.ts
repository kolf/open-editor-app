import Api from './config';
import queryString from 'querystring';
import { StatisticJobSchema } from 'src/declarations/schemas/StatisticJobSchema';

export class StatisticJobService {
  async getList(data: any): Promise<StatisticJobSchema.ListALl[]> {
    const res = await Api.get(`/api/outsourcing/statistic/list?${queryString.stringify(data)}`);
    return res.data.data;
  }
}

const statisticJobService = new StatisticJobService();

export default statisticJobService;
