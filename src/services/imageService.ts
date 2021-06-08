import Api from './config';

export class ImageService {
  async getList(data: any): Promise<any> {
    return await Api.post(`/api/editor/image/creativeList?type=creative&token=ST-144-9e7e1a89e4b5db948b030f54ec9085830`, data);
  }
}

const imageService = new ImageService();

export default imageService;
