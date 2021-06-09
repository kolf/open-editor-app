// import { Button, Table } from 'antd';
// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import Loading from 'src/components/common/Loading';
// import { RootState } from 'src/store';
// import modal from 'src/utils/confirm';

// const columns: Column[] = [
//   {
//     title: '序号',
//     dataIndex: 'index',
//   },
//   {
//     title: 'ID',
//     dataIndex: 'id',
//   },
//   {
//     title: '创建时间',
//     dataIndex: 'createTime',
//   },
// ];

// const createSource = () => {
//   modal({
//     width: 720,
//     title: '编审记录',
//     content: <div>
//       <ul>
//         <li>名称</li>
//         <li>审核类型 图片 视频</li>
//         <li>分配 人工 自动(全部资源)</li>
//         <li>资源类型 创意类 编辑类</li>
//         <li>敏感检测 检测 不检测</li>
//         <li>名称</li>
//       </ul>
//     </div>,
//     footer: null,
//   });
// };

// function List() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const user = useSelector((state: RootState) => state.user.user);

//   if (loading) return <Loading />;
//   return (
//     <>
//       <Button type="primary" onClick={createSource}>
//         创建数据来源
//       </Button>
//       <Table bordered columns={columns} />;
//     </>
//   );
//   // return <div onClick={openModal}>数据来源管理</div>;
// }

import React from 'react';
function List() {
  return <div>数据来源管理</div>;
}

export default List;
