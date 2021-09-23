import React, { useState, useEffect, useRef } from 'react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import ImageDetails from 'src/components/modals/ImageDetails';
import Loading from 'src/components/common/LoadingBlock';
import ImageLogs from 'src/components/modals/ImageLogs';
import UpdateKeywords, { IListItem as IKeywordsInListItem } from 'src/components/modals/UpdateKeywords';
import UpdateTitle, { PositionType } from 'src/components/modals/UpdateTitle';
import imageService from 'src/services/imageService';
import modal from 'src/utils/modal';
import * as tools from 'src/utils/tools';

type ITitleInListItem = Pick<IImage, 'id' | 'title'>;
interface Props<T> {
  list: T;
  onChange?: (list: T) => void;
}

export default function useImage({ list, onChange }: Props<IImage[]>) {
  const listRef = useRef<IImage[] | null>(list);
  const [selectedIds, setSelectedIds] = useState<IdList>([]);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

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
          onChange={onChange}
          defaultList={listRef.current
            .filter(item => idList.includes(item.id))
            .map(
              item =>
                ({
                  id: item.id,
                  keywordTags: item.keywordTags
                } as IKeywordsInListItem)
            )}
        />
      ),
      footer: null
    });

    function onChange(changedList: IKeywordsInListItem[]) {
      setSelectedList(idList, changedList);
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

      setSelectedList(idList, changedList);
    }

    function onReplace(findText: string, replaceText: string) {
      if (!findText) {
        message.info(`请输入查找内容！`);
        return;
      }
      const currentList = listRef.current;
      const changedList: ITitleInListItem[] = idList.map(id => {
        const item = currentList.find(c => c.id === id);
        return { id, title: tools.trim(item.title).replaceAll(tools.trim(findText), tools.trim(replaceText)) };
      });

      setSelectedList(idList, changedList);
    }
  };

  // 显示图片详情
  const showDetails = async (index: number) => {
    const { id, urlSmall, urlYuan } = listRef.current[index];
    const mod = modal({
      title: `图片详情`,
      width: 640,
      content: <Loading />,
      footer: null
    });
    try {
      const res = await imageService.getExif({ id });
      mod.update({
        content: <ImageDetails dataSource={{ ...res, imgUrl: urlSmall, urlYuan }} />
      });
    } catch (error) {
      message.error(`请求接口出错！`);
      mod.close();
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
  const setSelectedList = <T extends IImage>(ids: IdList, changedList: T[] | T) => {
    const idList: IdList = ids || [...selectedIds];
    const isUpdateList = Array.isArray(changedList);

    const nextList = listRef.current.map(item => {
      if (idList.includes(item.id)) {
        return {
          ...item,
          ...(isUpdateList ? (changedList as T[]).find(p => p.id === item.id) : changedList)
        };
      }
      return item;
    });

    onChange && onChange(nextList);
  };

  // 点击单张选择图片， TODO待优化
  const onSelect = (index: number) => {
    const { id } = listRef.current[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds);
  };

  return {
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
