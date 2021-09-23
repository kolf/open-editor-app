import Api from './config';
import queryString from 'querystring';
import keywordService from './keywordService';

export class ImageService {
  async getList(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImage/pageList`, data);
    const { list, total } = res.data.data;
    const res1 = await this.getSentiveWordByImageIds(list.map(item => item.id));

    return {
      total,
      list: list.map(item => {
        return {
          ...item,
          sensitiveList: res1[item.id] || []
        };
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
    const res = await Api.post(
      `/api/outsourcing/osiImage/qualityReview?${queryString.stringify(data.query)}`,
      data.body
    );
    return res.data.data;
  }
  async update(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/osiImage/update?${queryString.stringify(data.query)}`, data.body);
    return res.data.data;
  }
  async getLogList(data: any): Promise<any> {
    const res = await Api.post(`/api/outsourcing/log/list4image`, data);
    return res.data.data.reverse();
  }
  async getKeywordTags(data: any): Promise<any> {
    const idList = data.reduce((result, item) => {
      const { keywords } = item;
      if (keywords) {
        const keywordList = keywords.match(/\d+/g) || [];
        return [...new Set([...result, ...keywordList])];
      }
      return result;
    }, []);
    if (idList.length === 0) {
      return Promise.resolve(data);
    }

    try {
      const res = await keywordService.getList(idList.join(','));
      return data.map(item => {
        const { keywords } = item;
        let keywordTags = [];
        if (keywords) {
          keywordTags = (keywords.match(/\d+/g) || []).reduce((result, id) => {
            const keywordObj = res.find(r => r.id + '' === id);
            if (keywordObj) {
              result.push({
                value: keywordObj.id + '',
                label: keywordObj.cnname,
                kind: keywordObj.kind
              });
            }
            return result;
          }, []);
        }
        return {
          ...item,
          keywordTags
        };
      });
    } catch (error) {
      return Promise.resolve(data);
    }
  }
  async getSentiveWordByImageIds(data: any): Promise<any> {
    try {
      const res = await Api.post(`/api/outsourcing/osiImageSensitiveReason/getSentiveWordByImageIds`, data);
      return res.data.data;
    } catch (error) {
      return {};
    }
  }
  async getSentiveWordDetails(keywordsList: any): Promise<any> {
    const ids = keywordsList.map(item => item.elephantSensitiveWordId).filter(id => id);
    if (ids.length === 0) {
      return Promise.resolve(keywordsList);
    }
    try {
      const res = await Api.post(`/api/outsourcing/osiImageSensitiveReason/getSentiveWordDetailById`, ids);
      const data = res.data.data;
      return keywordsList.map(item => {
        const newItem = data.find(d => d.id === item.elephantSensitiveWordId);
        if (newItem) {
          return {
            ...item,
            ...newItem
          };
        }
        return item;
      });
    } catch (error) {
      return Promise.resolve(keywordsList);
    }
  }
}

const imageService = new ImageService();

export default imageService;
