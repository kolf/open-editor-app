import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { Modal, Button, Space, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import imageService from 'src/services/imageService';
const dateFormat = 'YYYY-MM-DD';

function List() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState([]);
  const { data, loading, error, run, refresh } = useRequest(imageService.getList, { manual: true });
  const { run: updateStatus } = useRequest(imageService.qualityReview, { manual: true });
  const { list, total } = data || { list: [], total: 0 };

  useEffect(() => {
    run(makeQuery(query));
  }, [query]);

  function makeQuery(query) {
    const result = Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (/Time$/g.test(key)) {
        result[key] = value.format(dateFormat);
      } else if (typeof value === 'object') {
        result[key] = value.key;
      } else if (value) {
        result[key] = value;
      }
      return result;
    }, {});

    return result;
  }

  const handleClick = (index, field) => {
    switch (field) {
      case 'id':
        showDetails(index);
        break;
      case 'cover':
        handleSelect(index);
        break;

      default:
        alert(field);
        break;
    }
  };

  const handleChange = (index, field, value) => {
    switch (field) {
      case 'RR':
        setRR(index, value);
        break;

      default:
        alert(field);
        break;
    }
  };

  const handleSelect = index => {
    const { id } = list[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds);
  };

  const checkSelectedIds = async () => {
    if (selectedIds.length === 0) {
      message.info(`请选择图片！`);
      return Promise.reject();
    }
    return [...selectedIds];
  };

  const showDetails = index => {
    alert(index);
  };

  // 设置通过
  const setResolve = async e => {
    const idList = await checkSelectedIds();
    const imageList = list.filter(item => idList.includes(item.id));
    try {
      const res = await updateStatus({ body: imageList, query: { stage: 1, status: 1 } });
      setSelectedIds([]);
      message.success(`设置通过成功！`);
      refresh();
    } catch (error) {
      message.error(`设置通过失败！`);
    }
  };

  // 设置不通过
  const setReject = async e => {
    const idList = await checkSelectedIds();
    const rejectReason = await confirmRejectReason();
    const imageList = list.filter(item => idList.includes(item.id));
    try {
      const res = await updateStatus({
        body: imageList,
        query: { stage: 1, status: 2, standardReason: rejectReason.join(',') }
      });
      setSelectedIds([]);
      message.success(`设置不通过成功！`);
      refresh();
    } catch (error) {
      message.error(`设置不通过失败！`);
    }
  };

  // 确认不通过原因
  const confirmRejectReason = async () => {
    return [];
  };

  // 设置rf, rm
  const setRR = async (index, value) => {
    const idList = index === -1 ? await checkSelectedIds() : [list[index].id];
    const imageList = list.filter(item => idList.includes(item.id));

    alert(`设置RFRm`);
  };

  // 设置等级
  const setQuality = async value => {
    await checkSelectedIds();
    alert(`设置等级`);
  };

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} />
      <Toolbar
        onSelectIds={setSelectedIds}
        selectedIds={selectedIds}
        idList={list.map(item => item.id)}
        dataTotal={total}
      >
        <Space>
          <Button type="text" style={{ marginLeft: 8 }}>
            审核
          </Button>
          <Button title="通过" onClick={setResolve} icon={<CheckOutlined />} />
          <Button title="不通过" onClick={setReject} icon={<CloseOutlined />} />
          <Button type="text" style={{ marginLeft: 8 }}>
            编辑
          </Button>
          <Button title="通过" onClick={e => setRR(-1, 'rf')}>
            RF
          </Button>
          <Button title="不通过" onClick={e => setRR(-1, 'rm')}>
            RM
          </Button>
          <Button title="通过" onClick={e => setQuality('1')}>
            A
          </Button>
          <Button title="不通过" onClick={e => setQuality('2')}>
            B
          </Button>
          <Button title="通过" onClick={e => setQuality('3')}>
            C
          </Button>
          <Button title="不通过" onClick={e => setQuality('4')}>
            D
          </Button>
        </Space>
      </Toolbar>
      <GridList
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <ListItem
            selected={selectedIds.includes(item.id)}
            dataSource={item}
            index={index}
            onClick={field => handleClick(index, field)}
            onChange={(field, value) => handleChange(index, field, value)}
          />
        )}
      />
    </>
  );
}

export default List;
