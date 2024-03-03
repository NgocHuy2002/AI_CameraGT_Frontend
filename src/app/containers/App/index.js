import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import Cookies from 'js-cookie';

import Menu from '@components/Menu';
import LoginRoutes from '@app/router/LoginRoutes';
import Loading from '@components/Loading';
import CustomBreadcrumb from '@components/CustomBreadcrumb/CustomBreadcrumb';
import HeaderMenu from '@components/Header/HeaderMenu';
import AppContent from '@containers/App/AppContent';
import ChangePassword from '@containers/App/ChangePassword';

import { URL } from '@url';
import { CONSTANTS } from '@constants';

import * as app from '@app/store/ducks/app.duck';
import * as user from '@app/store/ducks/user.duck';
import * as caiDat from '@app/store/ducks/caiDat.duck';

import { convertMoment } from '@app/common/functionCommons';
import moment from 'moment';
import { t } from 'i18next';

const { Footer } = Layout;

function App({ isLoading, siderCollapsed, token, refreshToken, history, moduleApp, myInfo, configChung, ...props }) {
  const { pathname } = history.location;

  const [isBroken, setBroken] = useState(false);
  const [isShowDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    // props.getConfigChung();
    props.getToken();
    props.getRefreshToken();

    handleLogoutAllTab();
  }, []);

  useEffect(() => {
    props.getPermission();
  }, [myInfo]);

  useEffect(() => {
    if (token && token !== CONSTANTS.INITIAL) {
      props.getCaiDatHeThong();
      props.requestUser(history);

      if (pathname === URL.LOGIN) {
        history.push(URL.MENU.DASHBOARD);
      }
    }
  }, [token]);

  if (myInfo.lastChangePassword) {
    const lastChangePassword = convertMoment(myInfo.lastChangePassword);
    const diff = moment().diff(lastChangePassword, 'days');
    let requiredChangePassword = diff > myInfo.caiDatHeThong?.phienDoiMatKhau;

    if (myInfo?.neverLogin || requiredChangePassword) {
      return <ChangePassword />;
    }
  }

  function handleLogoutAllTab() {
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage && event.key === window.location.host + CONSTANTS.LOG_OUT) {
        let isLogout = localStorage.getItem(window.location.host + CONSTANTS.LOG_OUT);
        if (isLogout) {
          props.clearToken();
        } else if (token === CONSTANTS.INITIAL && !isLogout) {
          const cookiesToken = Cookies.get('token');
          props.setToken(cookiesToken);

          const cookiesRefreshToken = Cookies.get('refreshToken');
          props.setRefreshToken(cookiesRefreshToken);

          history.replace(URL.MENU.DASHBOARD);
        }
      }
    }, false);
  }

  function onBreakpoint(broken) {
    setBroken(broken);
    setShowDrawer(false);
  }

  function toggleCollapsed() {
    if (isBroken) {
      setShowDrawer(!isShowDrawer);
    } else {
      props.toggleSider(!siderCollapsed);
    }
  }

  if (token === CONSTANTS.INITIAL) return null;

  const isResetPassword = URL.RESET_PASSWORD === history?.location?.pathname;
  if (isResetPassword) {
    return <Suspense fallback={<Loading />}>
      <LoginRoutes/>
    </Suspense>;
  }

  return <Layout>
    <Menu
      isBroken={isBroken}
      onBreakpoint={onBreakpoint}
      toggleCollapsed={toggleCollapsed}
      isShowDrawer={isShowDrawer}
      width={230}
    />

    <Layout className="site-layout">
      <HeaderMenu
        isBroken={isBroken}
        siderCollapsed={siderCollapsed}
        toggleCollapsed={toggleCollapsed}
      />

      <div id="content-container" className={`custom-scrollbar flex-column${!token ? ' login' : ''}`}>
        <CustomBreadcrumb />
        <AppContent />


        {false && token && myInfo?.roleId &&
          <Footer id="footer" style={{ textAlign: 'center' }}>


            <div className="power-by">
              <span className="power-by__text">{t('PHAT_TRIEN_BOI')}</span>
              <span className="power-by__text">&nbsp;</span>
              <span className="power-by__text logo__think">Think</span>
              <span className="power-by__text logo__labs">LABs</span>
              {/*<span className="power-by__text">&nbsp;</span>*/}
              {/*<img src={THINKLABS_LOGO} alt="THINKLABS_LOGO" className="power-by__logo"/>*/}
              <span className="power-by__text">&nbsp;</span>
              <span className="power-by__text">{t('VAN_HANH_BOI')}</span>
              <span className="power-by__text">&nbsp;</span>
              <span className="power-by__text logo__evn">EVN</span>
              <span className="power-by__text logo__npt">NPT</span>
              {/*<span className="power-by__text">&nbsp;</span>*/}
              {/*<img src={EVNNPT_LOGO} alt="EVNNPT_LOGO" className="power-by__logo"/>*/}
            </div>
          </Footer>}
      </div>
    </Layout>

  </Layout>;
}


function mapStateToProps(store) {
  const { siderCollapsed, token } = store.app;
  const { myInfo } = store.user;
  const { moduleApp } = store.module;
  return { siderCollapsed, token, myInfo, moduleApp };
}

export default (connect(mapStateToProps, { ...app.actions, ...user.actions, ...caiDat.actions })(withRouter(App)));
