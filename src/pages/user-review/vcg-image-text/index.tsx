import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { Table, Button, Tag, Result } from 'antd';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import imageService from 'src/services/imageService';
const dateFormat = 'YYYY-MM-DD';

function List() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState([]);
  const { data, loading, error, run } = useRequest(imageService.getList, { manual: true });
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

  const handleSelect = index => {
    const { id } = list[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds)
  };

  const showDetails = index => {
    alert(index);
  };

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} />
      <Toolbar
        onSelectIds={setSelectedIds}
        selectedIds={selectedIds}
        idList={list.map(item => item.id)}
        dataTotal={total}
      ></Toolbar>
      <GridList
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <ListItem
            selected={selectedIds.includes(item.id)}
            dataSource={item}
            index={index}
            onClick={field => handleClick(index, field)}
          />
        )}
      />
    </>
  );
}

export default List;
