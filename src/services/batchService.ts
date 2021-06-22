import { BatchAssignTarget, Priority } from 'src/declarations/enums/query';
import Api from './config';
import queryString from 'querystring';
import { OsiBatchSchema } from 'src/declarations/schemas/OsiBatchSchema';
import { CommonSchema } from 'src/declarations/schemas/CommonSchema';

export class BatchService {
  async getList(data: any): Promise<CommonSchema.TableList<OsiBatchSchema.PageList>> {
    const res = await Api.post(`/api/outsourcing/osiBatch/pageList`, data);
    return res.data.data;
  }

  // 数据分配
  async assign({
    assignType,
    osiBatchId,
    priority,
    userList
  }: {
    assignType: BatchAssignTarget,
    osiBatchId: string,
    priority: Priority,
    userList: { id: string; name: string }[]
  }): Promise<any> {
    return await Api.post(
      `/api/outsourcing/osiBatch/assign?${queryString.stringify({ assignType, osiBatchId, priority })}`,
      userList
    );
  }
}

const bacthService = new BatchService();

export default bacthService;
