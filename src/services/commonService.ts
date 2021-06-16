import Api from './config';

export class CommonService {
  async getOptions(data: any): Promise<any> {
    // TODO 传多个value查多个
    let result = []
    try {
      if (data.type === 'category') {
        const res = await Api.get(`/api/outsourcing/osiImage/listCategory`);
        result = res.data.data.map(item => ({
          value: item.id + '',
          label: item.categoryName
        }))
      } else if (data.type === 'provider') {
        const res = await Api.get(`/api/outsourcing/OsiDbProvider/listAll`);
        result = res.data.data.map(item => ({
          value: item.id + '',
          label: item.name
        }))
      }
      return Promise.resolve(result)
    } catch (error) {
      throw new Error(error);
    }
  }
}

const commonService = new CommonService();

export default commonService;
