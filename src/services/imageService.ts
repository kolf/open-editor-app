import Api from './config';
import queryString from 'querystring'

export class ImageService {
  async getList(data: any): Promise<any> {
    let res = await Api.post(`/api/outsourcing/osiImage/pageList`, data);
    return res.data.data;
  }
  async getExif(data: any): Promise<any> {
    let res = await Api.post(`/api/outsourcing/osiImage/getExif?${queryString.stringify(data)}`);
    return res.data.data;
  }
  async qualityReview(data: any): Promise<any> {
    let res = await Api.post(`/api/outsourcing/osiImage/qualityReview?${queryString.stringify(data.query)}`, data.body);
    return res.data.data
  }
  async update(data: any): Promise<any> {
    let res = await Api.post(`/api/outsourcing/osiImage/update?${queryString.stringify(data.query)}`, data.body);
    return res.data.data
  }
}

const imageService = new ImageService();

export default imageService;
