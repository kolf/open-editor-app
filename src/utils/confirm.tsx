import React from 'react';
import { ModalFuncProps } from 'antd/lib/modal/Modal';
import modal from './modal';

export default function confirm(config: ModalFuncProps): Promise<any> {
  return new Promise((resolve, reject) => {
    const content =
      typeof config.content === 'string' ? (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>{config.content} </div>
      ) : (
        config.content
      );
    const mod = modal({
      ...config,
      content,
      onOk() {
        resolve(mod);
      },
      onCancel() {
        reject();
      }
    });
  });
}
