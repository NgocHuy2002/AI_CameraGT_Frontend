import '@babel/polyfill';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import i18n from '@app/translations/i18n';

import store, { persistor } from './app/store/store';
import '@app/common/prototype';
import 'sanitize.css/sanitize.css';
import 'font-awesome/css/font-awesome.css';
import 'react-toastify/dist/ReactToastify.css';
// import 'react-leaflet-fullscreen/dist/styles.css';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';
// import 'react-leaflet-markercluster/dist/styles.min.css';

import './styles/theme.less';
import './styles/main.scss';
import './styles/header.less';
import './styles/select-module.less';


// Import root app
import App from '@containers/App';

import '!file-loader?name=[name].[ext]!@assets/favicon/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess';

// Import verify ssl
import './.well-known/pki-validation/B39680396573B1406ACA3AC2B8BEC5A2.txt';

import { setupAxios } from '@src/utils/utils';

const { PUBLIC_URL } = process.env;
const MOUNT_NODE = document.getElementById('root');
const language = localStorage.getItem('i18nextLng');

setupAxios(axios, store);

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <ConfigProvider locale={language === 'vi' ? viVN : enUS}>
        <BrowserRouter basename={PUBLIC_URL}>
          <ToastContainer pauseOnFocusLoss={false}/>
          <App/>
        </BrowserRouter>
      </ConfigProvider>
    </I18nextProvider>
  </Provider>,
  MOUNT_NODE,
);

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  const runtime = require('offline-plugin/runtime'); // eslint-disable-line global-require
  runtime.install({
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated');
      // Reload the webpage to load into the new version
      window.location.reload();
    },
    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });
}
