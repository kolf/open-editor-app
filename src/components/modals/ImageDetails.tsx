import React, { ReactElement } from 'react';
import { Row, Col } from 'antd';
import defaultUrl from 'src/assets/img/image.png';
import { FormattedMessage } from 'react-intl';
import { zhCNMap } from 'src/locales/zhCN';
const defaultName = '---';

interface Props {
  dataSource: any;
}

const exifMap = {
  model: '机型',
  dateTimeOriginal: '原始日期时间',
  dateModified: '修改时间',
  modifiedSoftware: '修改程序',
  exposureMode: '曝光模式',
  focalLength: '焦距',
  flash: '闪光灯',
  meteringMode: '测光模式',
  whiteBalance: '白平衡',
  resolution: '分辨率',
  fileSize: '尺寸',
  colorSpace: '色彩空间',
  picSize: '大小',
  iso: '感光度',
  exposureTime: '快门速度',
  fNumber: '光圈值',
  make: '相机制造商',
  lens: '镜头'
};

function open(imgUrl: string) {
  window.open(imgUrl);
}

export default function ImageDetails({ dataSource }: Props): ReactElement {
  return (
    <>
      <Row>
        <Col span={12}>
          <div style={{ paddingRight: 24, display: 'flex',height:500 }} onClick={e => open(dataSource.urlYuan)}>
            <img src={dataSource.imgUrl || defaultUrl} style={{ maxWidth: '100%', margin: 'auto' }} />
          </div>
        </Col>
        <Col span={12}>
          <h3 style={{ textAlign: 'center' }}><FormattedMessage id='Headline'/></h3>
          <Row>
            <Col span={4}><FormattedMessage id='AI'/></Col>
            <Col span={19}>{dataSource.aiTitle || defaultName}</Col>
            <Col span={4}><FormattedMessage id='User'/></Col>
            <Col span={19}>{dataSource.title || defaultName}</Col>
          </Row>
          <h3 style={{ textAlign: 'center' }}><FormattedMessage id='Keywords'/></h3>
          <Row>
            <Col span={6}>AI用户点选</Col>
            <Col span={18}>
              {dataSource.aiKeywordsSelected ? dataSource.aiKeywordsSelected.join('，') : defaultName}
            </Col>
            <Col span={6}>AI用户未点选</Col>
            <Col span={18}>
              {dataSource.aiKeywordsUnselected ? dataSource.aiKeywordsUnselected.join('，') : defaultName}
            </Col>
            <Col span={6}>用户</Col>
            <Col span={18}>{dataSource.aiKeywordsUnselected ? dataSource.userKeywords.join('，') : defaultName}</Col>
          </Row>
          {dataSource && (
            <>
              <h3 style={{ textAlign: 'center' }}>EXIF</h3>
              {Object.keys(exifMap).map(key => (
                <div className="ant-row" key={key}>
                  <div className="ant-col-8">
                    <FormattedMessage id={zhCNMap[exifMap[key]]}/>
                  </div>
                  <div className="ant-col-16">{dataSource.exif[key] || '---'}</div>
                </div>
              ))}
            </>
          )}
        </Col>
      </Row>
    </>
  );
}
