import Api from './config';
import queryString from 'querystring';

export class KeywordService {
  async findList(data: string): Promise<Array<any>> {
    try {
      const nameList = [...new Set(data.split(/,|，/g).filter(name => name))];
      const res = await Api.post(`/api/editor/proxy/post?url=gc/kw/find/batch`, { name: nameList });
      return nameList.map(name => {
        const data = JSON.parse(res.data[name] || '[]');
        if (data.length === 0) {
          return { label: name, value: name };
        } else if (data.length === 1) {
          const oneData = data[0];
          return { label: oneData.cnname, value: oneData.id + '', kind: oneData.kind };
        } else {
          return { label: name, value: data.map(item => item.id).join(',') };
        }
      });
    } catch (error) {
      return [];
    }
  }
  async get(data: string): Promise<any> {
    try {
      const res = await Api.post(`/api/editor/proxy/post?url=gc/keyword/get/id`, { data });
      return res.data;
    } catch (error) {
      throw new Error(`关键词接口出错！`);
    }
  }
  async getList(data: string): Promise<Array<any>> {
    try {
      const idList = [...new Set(data.split(/,|，/g).filter(id => /\d+/g.test(id)))];
      const res = await Api.post(`/api/editor/proxy/post?url=gc/keyword/get/ids`, { data: idList.join(',') });
      return res.data;
    } catch (error) {
      return [];
    }
  }
}

const keywordService = new KeywordService();

export default keywordService;
