import Api from './config';

export class ImageService {
  async getList(data: any): Promise<any> {
    let res = await Api.post(`/api/outsourcing/osiImage/pageList`, data);
    return res.data.data
  }
}

const imageService = new ImageService();

export default imageService;
