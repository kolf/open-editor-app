import React from 'react';
import modal from 'src/utils/confirm';

function List() {
  const openModal = () => {
    modal({
      width: 720,
      title: '编审记录',
      content: <div>哈哈哈</div>,
      footer: null,
    });
  };
  return <div onClick={openModal}>数据来源管理</div>;
}

export default List;
