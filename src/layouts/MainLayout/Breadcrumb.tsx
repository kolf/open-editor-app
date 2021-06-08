import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { PATH } from 'src/routes/path';
import { menus } from '../../routes/menus';

const breadcrumbNameMap: any = {};

menus.forEach((item: any) => {
  breadcrumbNameMap[`'${item.path}'`] = item.breadcrumbName;
  if (item.hasChild) {
    item.children.forEach((sub: any) => {
      breadcrumbNameMap[`'${sub.path}'`] = sub.breadcrumbName;
    });
  }
});

const BreadcrumbMenu = () => {
  const pathSnippets = [...location.pathname.split('/')].filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

    const getObjectPath = menus.filter((item: any) => item.path === url);

    let isDisable = false;
    if (getObjectPath[0] !== undefined) isDisable = getObjectPath[0].hasChild;
    if (breadcrumbNameMap[`'${url}'`])
      return (
        <Breadcrumb.Item key={url}>
          {isDisable ? (
            <span>{breadcrumbNameMap[`'${url}'`]}</span>
          ) : (
            <Link to={url}>{breadcrumbNameMap[`'${url}'`]}</Link>
          )}
        </Breadcrumb.Item>
      );
    return <Breadcrumb.Item key={url}></Breadcrumb.Item>;
  });

  return <Breadcrumb>{extraBreadcrumbItems}</Breadcrumb>;
};

export default BreadcrumbMenu;
