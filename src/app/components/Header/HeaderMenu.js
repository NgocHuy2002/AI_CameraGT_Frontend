import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown, Layout, Menu } from 'antd';

import Notifications from './Notifications';
import DownloadApp from '@components/Header/DownloadApp';
import { API } from '@api';
import { URL } from '@url';

import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';
import * as module from '@app/store/ducks/module.duck';

import './Header.less';

import ARROW_LEFT from '@assets/images/icon/arrow-left.svg';
import ARROW_RIGHT from '@assets/images/icon/arrow-right.svg';
import USER from '@assets/images/icon/user.svg';
import CAMERA_LOGO from '@assets/images/logo/CAMERA-LOGO.svg';

import Cookies from 'js-cookie';
import { deleteRefreshToken } from '@app/services/RefreshToken';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
import MultiLanguage from '@components/Header/MultiLanguage';
import { configTree } from '@app/config/config';

function HeaderMenu({ token, history, caiDatHeThong, myInfo, isBroken, siderCollapsed, moduleApp, ...props }) {
  if (!token) return null;
  const [isAvatarLoader, setAvatarLoader] = useState(false);

  const { pathname } = history.location;
  const { toggleCollapsed } = props;
  // const configChung = JSON.parse(localStorage.getItem('configChung'));

  async function handleLogout() {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) await deleteRefreshToken(refreshToken);
    props.clearToken();
    // props.clearModuleApp();
  }

  const menu = (
    <Menu selectedKeys={pathname}>
      <Menu.Item key={URL.MY_INFO}>
        <Link to={URL.MY_INFO}>{t('THONG_TIN_CA_NHAN')}</Link>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>{t('DANG_XUAT')}</Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className="site-layout-background position-relative" size="small"
                   style={{ padding: 0, position: 'sticky', top: 0, left: 0, right: 0, zIndex: 2 }}>
      {moduleApp
        ? <>
          <span className="toggle-menu">
            <img src={siderCollapsed ? ARROW_RIGHT : ARROW_LEFT} alt="" onClick={toggleCollapsed}/>
          </span>
          <span className="toggle-drawer-menu">
            <img src={ARROW_RIGHT} alt="" onClick={toggleCollapsed}/>
          </span>
        </>
        : <div className="sider-logo float-left">
          <div className="logo">
            {/* <img src={NEW_LOGO} alt="" /> */}
            <img src={CAMERA_LOGO} alt="" />
          </div>
        </div>}

      <div className="application-name position-center">
        <strong>
          <div className="application-name__text">{t('HE_THONG_CAMERA_GIAM_SAT_CANH_BAO').toLowerCase()}</div>
          <div className="application-name__text application-name-mobile">Hệ thống camera AI</div>
          <div className="application-name__text application-name-mobile">giám sát cảnh báo</div>
        </strong>
      </div>
      <div className="header-action" style={moduleApp ? {} : { width: 'unset' }}>
        {configTree.Common.multiLanguage && <MultiLanguage/>}

        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
          <div className="my-info-container">
            <div className="my-info__avatar">
              {myInfo.avatar
              && <img onLoad={() => setAvatarLoader(true)} src={API.PREVIEW_ID.format(myInfo.avatar)}
                      style={{ borderRadius: '12px', display: isAvatarLoader ? 'block' : 'none' }} alt=""/>}
              {(!isAvatarLoader || !myInfo?.avatar) && <img src={USER} alt=""/>}
              <span className="my-info__name">{myInfo.fullName}</span>
            </div>
          </div>
        </Dropdown>

        <Notifications />
      </div>
    </Layout.Header>
  );
}

function mapStateToProps(store) {
  const { siderCollapsed, isBroken, token } = store.app;
  const { myInfo } = store.user;
  const { caiDatHeThong } = store.caiDat;
  const { moduleApp } = store.module;
  return { siderCollapsed, isBroken, token, myInfo, moduleApp, caiDatHeThong };
}

export default withTranslation()(connect(mapStateToProps, { ...app.actions, ...user.actions, ...module.actions })(withRouter(HeaderMenu)));
