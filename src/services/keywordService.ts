import Api from './config';
import queryString from 'querystring';
import { IKeyword } from '../components/modals/PersonKeywords';

export interface ICheckAmbiguityKeywords {
  ambiguityKeywordsIds?: IdList;
  key: string;
  keywordsIds?: string;
}

export class KeywordService {
  async findList(data: string): Promise<Array<any>> {
    try {
      const nameList = [...new Set(data.split(/,|，/g).filter(name => name))];
      const res = await Api.post(`/api/editor/proxy/post?url=gc/kw/find/batch`, { name: nameList });
      return nameList.map(name => {
        const data: IKeyword[] = JSON.parse(res.data[name] || '[]');
        if (data.length === 1) {
          const oneData = data[0];
          return { label: oneData.cnname, value: oneData.id + '', type: 1, kind: oneData.kind };
        } else if (data.length > 1) {
          return { label: name, value: data.map(item => item.id).join(','), type: 2 };
        } else {
          return { label: name, value: name, type: 0 };
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
  async checkAmbiguity<T extends ICheckAmbiguityKeywords>(data: T[]): Promise<T[]> {
    try {
      const res = await Api.post(`/api/editor/param/checkAmbiguity`, data);
      return res.data.data || [];
    } catch (error) {
      return [];
    }
  }
  sort<T extends IKeywordsTag>(data: T[]): T[] {
    return data.sort((a, b) => {
      let n: number = a.type;
      let m: number = b.type;

      if (n === 1) {
        n = -2;
      }
      if (m === 1) {
        m = -2;
      }
      if (a.color === 'gold') {
        n = -1;
      }
      if (b.color === 'gold') {
        m = -1;
      }
      if (a.color === 'blue') {
        n = 3;
      }
      if (b.color === 'blue') {
        m = 3;
      }
      return m - n;
    });
  }
}

const keywordService = new KeywordService();

export default keywordService;
