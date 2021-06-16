import Api from './config';

export class CommonService {
  async getOptions(value: string): Promise<any> {
    // TODO 传多个value查多个
    let result = []
    try {
      if (value === 'category') {
        const res = await Api.get(`/api/outsourcing/osiImage/listCategory`);
        console.log(res, 'res')
      } else if (value === 'provider') {
        const res = await Api.get(`/api/outsourcing/OsiDbProvider/listAll`);
        console.log(res, 'res')
      }
      return Promise.resolve(result)
    } catch (error) {
      throw new Error(error);
    }
  }
}

const commonService = new CommonService();

export default commonService;
