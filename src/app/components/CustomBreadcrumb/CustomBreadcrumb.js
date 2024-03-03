import React, { useEffect, useState, useRef } from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { URL } from '@url';
import { ConstantsRoutes } from '@app/router/ConstantsRoutes';
import { cloneObj, checkIsMobileOrTablet } from '@app/common/functionCommons';
import { createAccessHistory } from '@app/services/AccessHistory'

import * as app from '@app/store/ducks/app.duck';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';

function CustomBreadcrumb({ t, myInfo, locationPathCode, location, token, moduleApp, ...props }) {
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [reference, setReference] = useState('');
  const [title, setTitle] = useState('');
  const CONSTANTS_ROUTES = ConstantsRoutes(moduleApp);

  


  useEffect(() => {
    let { pathname } = location;
    setReference(locationPathCode);
    Object.entries(URL).forEach(([urlKey, urlValue]) => {
      if (typeof urlValue === 'string') {
        pathname = findPathname(pathname, urlKey, urlValue);
      }
      if (typeof urlValue === 'object') {
        Object.entries(urlValue).forEach(([menuKey, menuValue]) => {
          pathname = findPathname(pathname, menuKey, menuValue);
        },
        );
      }
    });
    props.setLocationPathCode(pathname);
  }, [location.pathname]);

  useEffect(() => {
    requestInfoVisits();
  }, [title])

  const requestInfoVisits = async () => {
    if (title.length) {
      const checkMobile = checkIsMobileOrTablet();
      const dataRequest = {
        pageUrl: location.pathname,
        userId: myInfo._id,
        reference: reference,
        pageTitle: title,
        deviceType: checkMobile? 'Mobile browser' : 'Desktop or laptop browser',
      };
      // console.log('width', (window.innerWidth > 0) ? window.innerWidth : screen.width);
      createAccessHistory(dataRequest);
    }
  }

  useEffect(() => {
    if (moduleApp) {
      renderBreadcrumb();
    }
  }, [locationPathCode, moduleApp, t]);

  function findPathname(pathname, key, value) {
    let pathReturn = pathname;
    if (key.includes('_ID') && key.indexOf('_ID') === key.length - 3) {
      const valueTemp = value.slice(0, value.length - 3);
      if (pathReturn.includes(valueTemp)) {
        pathReturn = value.format(':id');
      }
    }
    return pathReturn;
  }

  function renderBreadcrumb(routes = CONSTANTS_ROUTES, parents = []) {
    parents = cloneObj(parents);
    return routes.map(async route => {
      if (route.path === locationPathCode) {
        let xhtml = [];
        let titleName = '';
        parents.map(parent => {
          xhtml.push(<Breadcrumb.Item key={parent.key || parent.path}>
            {parent.path
              ? <Link to={parent.path}>{t(parent.breadcrumbName || parent.menuName)}</Link>
              : t(parent.breadcrumbName || parent.menuName)}
          </Breadcrumb.Item>);
          titleName += '/' + t(parent.breadcrumbName || parent.menuName);
        });
        xhtml.push(<Breadcrumb.Item key={route.path}>{t(route.breadcrumbName || route.menuName)}</Breadcrumb.Item>);
        titleName += '/' + t(route.breadcrumbName || route.menuName);
        setBreadcrumb(xhtml);
        setTitle(titleName);
      }

      if (Array.isArray(route.children)) {
        return renderBreadcrumb(route.children, [...parents, route]);
      }
    });
  }

  if (!moduleApp || !token || location.pathname === URL.MENU.DASHBOARD || !breadcrumb.length) return null;
  return (
    <Breadcrumb style={{ margin: '10px 16px 0 16px' }}>
      <Breadcrumb.Item>
        <Link to={URL.MENU.DASHBOARD}>
          <HomeOutlined />
        </Link>
      </Breadcrumb.Item>
      {breadcrumb}
    </Breadcrumb>
  );
}

function mapStateToProps(store) {
  const { token, locationPathCode } = store.app;
  const { myInfo } = store.user;
  const { moduleApp } = store.module;
  return { token, locationPathCode, moduleApp, myInfo };
}

export default withTranslation()(connect(mapStateToProps, app.actions)(withRouter(CustomBreadcrumb)));
