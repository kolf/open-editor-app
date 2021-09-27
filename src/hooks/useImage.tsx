import React from 'react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import ImageDetails from 'src/components/modals/ImageDetails';
import Loading from 'src/components/common/LoadingBlock';
import ImageLogs from 'src/components/modals/ImageLogs';
import imageService from 'src/services/imageService';
import modal from 'src/utils/modal';

interface IProps {
  id: string;
  urlSmall: string;
  urlYuan: string;
}

export default function useImage(list: Array<IProps>) {
  // 显示图片详情
  async function showDetails(index: number) {
    const { id, urlSmall, urlYuan } = list[index];
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
  }

  // 打开授权文件
  function openLicense(index: number) {
    const { id } = list[index];
    window.open(`/image/license?id=${id}`);
  }

  // 显示操作日志
  async function showLogs(index: number) {
    const { id } = list[index];
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
  }

  // 显示中图
  function showMiddleImage(index: number) {
    const { urlSmall } = list[index];
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
  }

  return {
    openLicense,
    showLogs,
    showDetails,
    showMiddleImage,
    list
  };
}
