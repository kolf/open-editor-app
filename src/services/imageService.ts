import Api from './config';
import queryString from 'querystring';
import keywordService, { ICheckAmbiguityKeywords } from './keywordService';

export class ImageService {
  joinKeywordIds(data: IImage[]): IdList {
    return [
      ...new Set(
        data.reduce((result, item) => {
          const { osiKeywodsData } = item;
          if (osiKeywodsData) {
            return [
              ...result,
              ...Object.values(JSON.parse(osiKeywodsData.keywordsAll || '{}'))
                .join(',')
                .split(',')
            ].filter(s => /^\d+$/.test(s));
          }
          return result;
        }, [])
      )
    ];
  }

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
    try {
      const res = await Api.post(`/api/outsourcing/osiImage/getExif?${queryString.stringify(data)}`);
      return res.data.data || {};
    } catch (error) {
      return {};
    }
  }
  async getKeywordDetails(data: any): Promise<any> {
    let result = {};
    try {
      const res = await Api.get(`/api/outsourcing/osiImage/keywordsInfoView?${queryString.stringify(data)}`);
      const res1 = await this.getKeywordTags([res.data.data]);
      const { title, keywordTags = [] } = res1[0];

      return {
        title,
        ...keywordTags.reduce((result, item) => {
          const { source, label } = item;
          if (result[source]) {
            result[source].push(label);
          } else {
            result[source] = [label];
          }
          return result;
        }, {})
      };
    } catch (error) {
      console.error(error);
    }
    return result;
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
  async keywordsReview(data: any): Promise<any> {
    const res = await Api.post(
      `/api/outsourcing/osiImage/keywordsReview?${queryString.stringify(data.query)}`,
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
  async checkAmbiguityKeywords<T extends IImage>(data: T[]): Promise<T[]> {
    const params: ICheckAmbiguityKeywords[] = data
      .map(item => ({
        key: item.id + '',
        keywordsIds: item.keywordTags
          .filter(t => t.type === 1 && t.kind == 4)
          .map(k => k.value)
          .join(',')
      }))
      .filter(item => /,/g.test(item.keywordsIds));

    let checkedList: ICheckAmbiguityKeywords[] = data.map(item => ({
      key: item.id + '',
      ambiguityKeywordsIds: []
    }));

    if (params.length > 0) {
      checkedList = await keywordService.checkAmbiguity(params);
    }

    return data.map(item => {
      const checkedItem = checkedList.find(c => c.key === item.id + '');
      const nextKeywordTags = item.keywordTags.map(k => ({
        ...k,
        color: checkedItem && checkedItem.ambiguityKeywordsIds.find(id => id + '' === k.value) ? '#03a9f4' : null
      }));

      return {
        ...item,
        keywordTags: nextKeywordTags
      };
    });
  }
  async getKeywordTags<T extends IImage>(data: T[]): Promise<T[]> {
    const idList = this.joinKeywordIds(data);
    if (idList.length === 0) {
      return Promise.resolve(data.map(item => ({ ...item, keywordTags: [] })));
    }

    try {
      const res = await keywordService.getList(idList.join(','));
      return data.map(item => {
        const { osiKeywodsData } = item;
        let keywordTags: IKeywordsTag[] = [];
        if (osiKeywodsData) {
          const keywordsAllObj: IKeywordsAll = JSON.parse(osiKeywodsData.keywordsAll || '{}');
          for (let key in keywordsAllObj) {
            keywordsAllObj[key].split(',').map((k: string) => {
              if (/^\d+$/.test(k)) {
                const keywordObj = res.find(r => r.id + '' === k);
                if (keywordObj && !keywordTags.find(k => k.value === keywordObj.value)) {
                  keywordTags.push({
                    value: keywordObj.id + '',
                    label: keywordObj.cnname,
                    kind: keywordObj.kind,
                    source: key as IKeywordsTag['source'], //TODO
                    type: 1
                  });
                }
              } else {
                const [label, id] = k.split('|');
                const value = id ? id.replaceAll('::', ',') : label;

                if (!keywordTags.find(k => k.value === value)) {
                  keywordTags.push({
                    value,
                    label: label,
                    source: key as IKeywordsTag['source'], //TODO
                    type: 2
                  });
                }
              }
            });
          }
        }
        return {
          ...item,
          keywordTags
        };
      });
    } catch (error) {
      console.log(error, 'error');
      return Promise.resolve(data.map(item => ({ ...item, keywordTags: [] })));
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
