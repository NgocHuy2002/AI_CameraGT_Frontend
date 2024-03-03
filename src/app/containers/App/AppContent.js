import React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { Layout } from 'antd';

import Routes from '@app/router/Routes';
import SelectModule from '@containers/App/SelectModule';


function AppContent({ myInfo, requiredChangePassword, moduleApp, token, ...props }) {
  if (moduleApp || !token) {
    return <div id="content">
      <Layout.Content className="site-layout-background">
        <Switch>
          <Routes/>
        </Switch>
      </Layout.Content>
    </div>;
  }
  if (Object.keys(myInfo)?.length && token && !moduleApp) {
    return <SelectModule/>;
  }
  return null;
}


function mapStateToProps(store) {
  const { token } = store.app;
  const { moduleApp } = store.module;
  const { myInfo, requiredChangePassword } = store.user;
  return { moduleApp, myInfo, token, requiredChangePassword };
}

export default connect(mapStateToProps)(AppContent);
