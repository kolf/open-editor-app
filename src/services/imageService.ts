import Api from './config';
import queryString from 'querystring'

export class ImageService {
  async getList(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImage/pageList`, data);
    const { list: imageList, total } = res.data.data
    const res1 = await this.getSentiveWordByImageIds(imageList.map(item => item.id));
    return {
      total,
      list: imageList.map(item => {
        return {
          ...item,
          sensitiveList: res1[item.id] || []
        }
      })
    };
  }
  async getExif(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImage/getExif?${queryString.stringify(data)}`);
    return res.data.data;
  }
  async getLicenseList(data: any): Promise<any> {
    const res = await Api.get(`/api/outsourcing/osiRelease/getImageRelease?${queryString.stringify(data)}`);
    return res.data.data;
  }
  async qualityReview(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImage/qualityReview?${queryString.stringify(data.query)}`, data.body);
    return res.data.data
  }
  async update(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImage/update?${queryString.stringify(data.query)}`, data.body);
    return res.data.data
  }
  async getSentiveWordByImageIds(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImageSensitiveReason/getSentiveWordByImageIds`, data);

    return res.data.data
  }
  async getSentiveWordDetails(keywordsList: any): Promise<any> {
    const ids = keywordsList
      .map((item) => item.elephantSensitiveWordId)
      .filter((id) => id);
    if (ids.length === 0) {
      return Promise.resolve(keywordsList);
    }
    try {
      const res = await Api.post(`/api/outsourcing/osiImageSensitiveReason/getSentiveWordDetailById`, ids);
      const data = res.data.data;
      return keywordsList.map((item) => {
        const newItem = data.find(
          (d) => d.id === item.elephantSensitiveWordId
        );
        if (newItem) {
          return {
            ...item,
            ...newItem,
          };
        }
        return item;
      })
    } catch (error) {
      return Promise.resolve(keywordsList);
    }
  }
}

const imageService = new ImageService();

export default imageService;
