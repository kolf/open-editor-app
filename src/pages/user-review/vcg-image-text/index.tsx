import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { Table, Space, Tag } from 'antd';
import GridList from 'src/components/list/GridList';
import FormList from './FormList';
import ListItem from './ListItem';
import imageService from 'src/services/imageService';

function List() {
  const [query, setQuery] = useState({ assetFamily: 2, desc: 2, pageType: 21, pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState([]);
  const { data, loading, error, run } = useRequest(() => imageService.getList(makeQuery(query)));

  useEffect(() => {
    run();
  }, [query]);

  function makeQuery(query) {
    let result = Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (Array.isArray(value)) {
        result[key] = value.map(item => item.key).join(',');
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
      case 'resId':
        showDetails(index);
        break;
      case 'cover':
        handleSelect(index);
        break;

      default:
        alert(field);
        break;
    }
    console.log(index, field);
  };

  const handleSelect = index => {
    alert(index);
  };

  const showDetails = index => {
    alert(index);
  };

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} />
      <div className="gap-top">
        <GridList
          loading={loading}
          dataSource={data?.list}
          renderItem={(item, index) => (
            <ListItem
              selected={selectedIds.includes(item.resId)}
              dataSource={item}
              index={index}
              onClick={field => handleClick(index, field)}
            />
          )}
        />
      </div>
    </>
  );
}

export default List;
