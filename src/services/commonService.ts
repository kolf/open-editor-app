import Api from './config';
import queryString from 'querystring';
import { getToken } from 'src/utils/localStorage';

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
      } else if (data.type === 'editUser') {
        const res = await Api.post(`/api/editor/param/pageList?paramType=4`, {
          assetFamily: 2,
          searchName: data.value
        });
        result = res.data.data.user.map(item => ({
          value: item.partyId,
          label: item.name
        }))
      }
      return Promise.resolve(result)
    } catch (error) {
      return Promise.resolve([])
    }
  }

  async getImageAllReason(data: any): Promise<any> {
    let res = await Api.get(`/api/outsourcing/reason`);
    return res.data.data
  }

  async getSentiveWordByImageIds(data: any): Promise<any> {
    let res = await Api.post(`/api/outsourcing/osiImageSensitiveReason/getSentiveWordByImageIds`, data);
    return res.data.data
  }
}

const commonService = new CommonService();

export default commonService;
