import React, { useState } from 'react';
import { isAndroid, isIOS } from 'react-device-detect';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { API } from '@api';
import { APP_ANDROID_TYPE } from '@constants';
import { renderURL } from '@app/common/functionCommons';

import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';
import * as module from '@app/store/ducks/module.duck';

import EVN_MOBILE from '@assets/icons/evn-mobile.svg';
import { Dropdown, Menu } from 'antd';
import { t } from 'i18next';

function DownloadApp({ caiDatHeThong, token, ...props }) {
  const iconHtml = <div className="evn-mobile__icon">
    <img src={EVN_MOBILE} alt=""/>
    <span className="evn-mobile__text">{t('TAI_APP')}</span>
  </div>;
  if (isIOS) {
    return <Link className="evn-mobile-container" to={`${API.INSTALL_LINK}?token=${token}`} target="_blank">
      {iconHtml}
    </Link>;
  }
  if (isAndroid) {
    let menuItemQldd;
    switch (caiDatHeThong?.androidAppType) {
      case APP_ANDROID_TYPE.FILE:
        menuItemQldd = <Link className="evn-mobile-container" to={API.ANDROID_APP} download target="_blank">
          {t('QUAN_LY_CAMERA_CANH_BAO')}
        </Link>;
        break;
      case APP_ANDROID_TYPE.LINK:
        menuItemQldd =
          <a className="evn-mobile-container" href={renderURL(caiDatHeThong?.linkAndroidApp)} target="_blank">
            {t('QUAN_LY_CAMERA_CANH_BAO')}
          </a>;
        break;
      default:
        break;
    }

    const menuOverlay = <Menu>
      <Menu.Item>{menuItemQldd}</Menu.Item>
      <Menu.Item>
        <Link className="evn-mobile-container" to={API.FLIGHT_CONTROL_APP} download target="_blank">
          {t('DIEU_KHIEN_BAY')}
        </Link>
      </Menu.Item>
    </Menu>;
    return <Dropdown
      overlay={menuOverlay}
      trigger={['click']} placement="bottomRight" arrow className="pull-left">
      <div className="evn-mobile-container">
        <div className="evn-mobile__icon">
          <img src={EVN_MOBILE} alt=""/>
          <span className="evn-mobile__text">{t('TAI_APP')}</span>
        </div>
      </div>
    </Dropdown>;


  }
  return null;
}

function mapStateToProps(store) {
  const { token } = store.app;
  const { caiDatHeThong } = store.caiDat;
  return { token, caiDatHeThong };
}

export default (connect(mapStateToProps, { ...app.actions, ...user.actions, ...module.actions })(withRouter(DownloadApp)));
