import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, message } from 'antd';
import ImageDetails from 'src/components/modals/ImageDetails';
import Loading from 'src/components/common/LoadingBlock';
import ImageLogs from 'src/components/modals/ImageLogs';
import UpdateKeywords, { IListItem as IKeywordsInListItem } from 'src/components/modals/UpdateKeywords';
import { removedSourceTypeReg } from 'src/components/KeywordTextAreaGroup';
import UpdateTitle, { PositionType } from 'src/components/modals/UpdateTitle';
import { DataContext } from 'src/components/contexts/DataProvider';
import imageService from 'src/services/imageService';
import keywordService from 'src/services/keywordService';
import modal from 'src/utils/modal';
import * as tools from 'src/utils/tools';
import { FormattedMessage } from 'react-intl';


type ITitleInListItem = Required<Pick<IImage, 'id' | 'title'>>;

interface Props<T> {
  list: T;
  onChange?: (list: T) => void;
}

export default function useImage({ list, onChange }: Props<IImage[]>) {
  const { reasonMap } = React.useContext(DataContext);
  const listRef = useRef<IImage[] | null>(list);
  const [selectedIds, setSelectedIds] = useState<IdList>([]);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const keywordTags2string = React.useCallback(
    (keywordTags: IKeywordsTag[]): { keywords: string; keywordsAudit: string; keywordsAll: string } => {
      let keywordArr = [];
      let keywordsAuditArr = [];
      const keywordsAllObj = keywordTags.reduce((result, item) => {
        const { value, label, source, type } = item;
        let keywordStr = '';
        if (type === 0) {
          keywordStr = `${label}||0|0`;
          if (!removedSourceTypeReg.test(source)) {
            keywordsAuditArr.push(keywordStr);
          }
        } else if (type === 1) {
          keywordStr = value;
          if (!removedSourceTypeReg.test(source)) {
            keywordArr.push(keywordStr);
          }
        } else if (type === 2) {
          keywordStr = `${label}|${value.replaceAll(',', '::')}|2|0`;
          if (!removedSourceTypeReg.test(source)) {
            keywordsAuditArr.push(keywordStr);
          }
        }

        result[source] = result[source] ? result[source] + ',' + keywordStr : keywordStr;
        return result;
      }, {});

      return {
        keywords: keywordArr.join(','),
        keywordsAudit: keywordsAuditArr.join(','),
        keywordsAll: JSON.stringify(keywordsAllObj)
      };
    },
    []
  );

  const getReasonTitle = React.useCallback(
    (value, otherValue?: string): string => {
      if (!value && !otherValue) {
        return '';
      }
      const valueList = typeof value === 'string' ? value.match(/\d+/g) : value;
      let result = (valueList || []).filter(v => reasonMap.has(v)).map(v => reasonMap.get(v));
      if (otherValue) {
        result.push(otherValue);
      }
      return result.join(',');
    },
    [reasonMap]
  );

  const updateKeywords = (idList: IdList): void => {
    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    const mod = modal({
      title: `修改关键词`,
      width: 760,
      autoIndex: false,
      content: (
        <UpdateKeywords
          onChange={update}
          defaultList={listRef.current
            .filter(item => idList.includes(item.id))
            .map(
              item =>
                ({
                  id: item.id,
                  keywordTags: item.keywordTags.map(k => ({ ...k, color: null }))
                } as IKeywordsInListItem)
            )}
        />
      ),
      footer: null
    });

    async function update(list) {
      let nextList = await imageService.checkAmbiguityKeywords(list);
      setSelectedList(nextList);
    }
  };

  // 修改标题
  const updateTitle = (idList: IdList): void => {
    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    const mod = modal({
      title: `修改标题`,
      content: <UpdateTitle onAdd={onAdd} onReplace={onReplace} />,
      footer: null
    });

    function onAdd(value: string, updateType: PositionType) {
      const currentList: IImage[] = listRef.current || [];
      let changedList: ITitleInListItem[] = [];
      let newTitle = tools.trim(value);

      if (updateType === 'content') {
        changedList = idList.map(id => ({
          id,
          title: newTitle
        }));
      } else {
        changedList = idList.map(id => {
          const item = currentList.find(c => c.id === id);
          const prevTitle = item.title || '';
          const nextTitle = updateType === 'after' ? `${newTitle}${prevTitle}` : `${prevTitle}${newTitle}`;
          return {
            id,
            title: nextTitle
          };
        });
      }

      setSelectedList(changedList);
    }

    function onReplace(searchValue: string, replaceValue: string) {
      if (!searchValue) {
        message.info(`请输入查找内容！`);
        return;
      }
      const currentList = listRef.current;
      const changedList: ITitleInListItem[] = idList.map(id => {
        const item = currentList.find(c => c.id === id);
        return { id, title: tools.trim(item.title).replaceAll(tools.trim(searchValue), tools.trim(replaceValue)) };
      });

      setSelectedList(changedList);
    }
  };
  // 显示图片详情
  const showDetails = async (index: number) => {
    const mod = modal({
      title: <FormattedMessage id='Photo Info/EXIF' />,
      width: 680,
      content: <Loading />,
      footer: null
    });

    update(index);

    async function update(index: number) {
      mod.update({
        content: <Loading />
      });

      const length = listRef.current.length;
      const { id, urlSmall, urlYuan } = listRef.current[index];
      try {
        const res = await Promise.all([imageService.getKeywordDetails({ id }), imageService.getExif({ id })]);
        mod.update({
          content: <ImageDetails dataSource={{ ...res[0], imgUrl: urlSmall, urlYuan, exif: res[1] }} />,
          footer: (
            <div style={{ display: 'flex' }}>
              <Button disabled={index === 0} onClick={e => update(index - 1)}>
                上一个
              </Button>
              <div style={{ flex: 1, textAlign: 'center', paddingTop: 6 }}>
                {index + 1}/{length}
              </div>
              <Button disabled={index === length - 1} onClick={e => update(index + 1)}>
                下一个
              </Button>
            </div>
          )
        });
      } catch (error) {
        message.error(`请求接口出错！`);
        mod.close();
      }
    }
  };

  // 打开授权文件
  const openLicense = (index: number) => {
    const { id } = listRef.current[index];
    window.open(`/image/license?id=${id}`);
  };

  // 打开原图
  const openOriginImage = (index: number) => {
    const idList: IdList = index === -1 ? selectedIds : [listRef.current[index].id];
    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }
    idList.forEach(id => {
      const { urlYuan } = listRef.current.find(item => item.id === id);
      window.open(urlYuan);
    });
  };

  // 显示操作日志
  const showLogs = async (index: number) => {
    const { id } = listRef.current[index];
    try {
      const res = await imageService.getLogList([id]);
      const mod = modal({
        title: `操作日志`,
        width: 640,
        content: <ImageLogs dataSource={res} />,
        footer: null
      });
    } catch (error) {
      message.error(`请求接口出错！`);
    }
  };

  // 显示中图
  const showMiddleImage = (index: number) => {
    const { urlSmall } = listRef.current[index];
    const mod = modal({
      title: `查看中图`,
      width: 640,
      content: (
        <div className="image-max">
          <img src={urlSmall} style={{ width: '100%' }} />
        </div>
      ),
      footer: null
    });
  };

  // 修改图片信息
  const setSelectedList = <T extends IImage>(changedList: T[]) => {
    const nextList = listRef.current.map(item => ({
      ...item,
      ...changedList.find(c => c.id === item.id)
    }));

    onChange && onChange(nextList);
  };

  // 点击单张选择图片， TODO待优化
  const onSelect = (index: number) => {
    const { id } = listRef.current[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds);
  };

  return {
    getReasonTitle,
    keywordTags2string,
    openLicense,
    openOriginImage,
    showLogs,
    showDetails,
    showMiddleImage,
    updateTitle,
    updateKeywords,
    onSelect,
    selectedIds,
    setSelectedIds,
    setList: setSelectedList
  };
}
