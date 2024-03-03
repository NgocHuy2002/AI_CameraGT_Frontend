import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { connect } from 'react-redux';

import { ConstantsRoutes } from '@app/router/ConstantsRoutes';
import { checkPermission } from '@app/rbac/checkPermission';
import { checkLoaded, formatUnique } from '@app/common/functionCommons';
import CAMERA_LOGO from '@assets/images/logo/CAMERA-LOGO.svg';

import * as app from '@app/store/ducks/app.duck';

import './CustomMenu.scss';
import { withTranslation } from 'react-i18next';
import { t } from 'i18next';
// import { MENUBAR } from '@configChung';

function CustomMenu({ siderCollapsed, isBroken, myInfo, locationPathCode, moduleApp, ...props }) {
  const keyRef = useRef([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [pathnameFormat, setPathnameFormat] = useState(null);
  const { userPermissions } = myInfo;
  const CONSTANTS_ROUTES = ConstantsRoutes(moduleApp);
  // const configChung = JSON.parse(localStorage.getItem('configChung'));

  useEffect(() => {
    if (siderCollapsed) {
      keyRef.current = openKeys;
      setOpenKeys([]);
    } else {
      setOpenKeys(keyRef.current);
    }
  }, [siderCollapsed]);

  useEffect(() => {
    let keys = [...openKeys, ...keyRef.current];
    CONSTANTS_ROUTES.forEach((menu) => {
      if (!menu.hide && menu.menuName && Array.isArray(menu.children)) {
        menu.children.forEach((child) => {
          if (!child.hide && pathnameFormat && [child.key, child.path].includes(pathnameFormat)) {
            keys = formatUnique([...keys, 'path' + (menu.key || menu.path)]);
          }
        });
      }
    });

    if (checkLoaded()) {
      if (siderCollapsed) {
        keyRef.current = keys;
      } else {
        setOpenKeys(keys);
      }
    } else {
      window.onload = function() {
        setOpenKeys(keys);
      };
    }
  }, [pathnameFormat]);

  function handleCheckPermission(permissionGranted, path) {
    return checkPermission(permissionGranted, path);
  }

  function handleActiveMenuForComponentDetail(menu) {
    if (menu.path !== pathnameFormat) {
      if (menu.path === locationPathCode) {
        setPathnameFormat(menu.path);
      }

      if (Array.isArray(menu.children)) {
        menu.children.forEach(child => {
          if (child.path === locationPathCode) {
            setPathnameFormat(menu.path);
          }
        });
      }
    }
  }

  function renderItem(menu) {
    handleActiveMenuForComponentDetail(menu);
    if (menu.hide || !menu.menuName) return;

    // if (configChung?.configMenu[MENUBAR[menu.path]] === false) {
    //   return;
    // }
    let hasPermission = checkPermission(userPermissions, menu.path);
    if (!hasPermission) return;
    return <Menu.Item key={menu.path} icon={menu.icon}>
      <Link to={menu.path}>{t(menu.menuName)}</Link>
    </Menu.Item>;
  }

  function handleTitleClick(value) {
    const { key } = value;
    if (openKeys.includes(key)) {
      setOpenKeys(openKeys.filter(openKey => openKey !== key));
    } else {
      setOpenKeys([...openKeys, key]);
    }
  }

  function renderSubItem(menu) {
    if (menu.hide) return;
    let hasPermission = handleCheckPermission(userPermissions, menu.path);
    if (menu.key) {
      let subMenuHasPermission = 0;
      menu.children.forEach(sub => {
        // if (configChung?.configMenu[MENUBAR[sub.path]] === false) {
        //   return;
        // }
        if (!sub.hide && handleCheckPermission(userPermissions, sub.path)) {
          subMenuHasPermission += 1;
        }
      });
      if (!subMenuHasPermission) {
        hasPermission = false;
        return;
      }
    }

    return <Menu.SubMenu
      key={'path' + menu.key}
      title={t(menu.menuName)}
      icon={menu.icon}
      onTitleClick={handleTitleClick}
      disabled={!hasPermission}
    >
      {hasPermission && menu.children.map((child) => {
        if (child.path) {
          return renderItem(child);
        }
        if (child.key && Array.isArray(child.children)) {
          return renderSubItem(child);
        }
      })}
    </Menu.SubMenu>;
  }

  const menuItem = CONSTANTS_ROUTES.map((menu) => {
    if (menu.path) {
      return renderItem(menu);
    }
    if (menu.key && Array.isArray(menu.children)) {
      return renderSubItem(menu);
    }
  });

  return <div style={{ height: '100%', overflow: 'hidden' }}>
    <div className={`sider-logo ${(siderCollapsed && !isBroken) ? 'collapsed' : ''}`}>
      <div className="logo">
        {/* <img src={NEW_LOGO} alt="" /> */}
        <img src={CAMERA_LOGO} alt="" />
      </div>
    </div>
    <div className="custom-scrollbar aside-menu">
      <Menu
        mode="inline" className="main-menu"
        {...siderCollapsed ? {} : { openKeys }}
        selectedKeys={[pathnameFormat]}
        expandIcon={({ isOpen }) => {
          if (!siderCollapsed)
            return <div className="expand-icon">
              <i className={`fa fa-chevron-right ${isOpen ? 'fa-rotate-90' : ''}`} aria-hidden="true"/>
            </div>;
          return null;
        }}
      >
        {menuItem}
      </Menu>
    </div>
  </div>;

}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, locationPathCode } = store.app;
  const { myInfo } = store.user;
  const { moduleApp } = store.module;
  return { siderCollapsed, isBroken, locationPathCode, myInfo, moduleApp };
}

export default withTranslation()(connect(mapStateToProps, app.actions)(CustomMenu));
