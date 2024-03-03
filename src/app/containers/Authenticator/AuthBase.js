import React from 'react';
import './AuthBase.scss';
import Cookies from 'js-cookie';

import LOGO_CAMERA from '@assets/images/logo/CAMERA-LOGIN-LOGO.svg';
// import BG_CAMERA from '@assets/background/BG-CAMERA.png';
import BG_CAMERA from '@assets/background/Background-Login.png';

function AuthBase({ children, ...props }) {
  return <div id="login">
      <img className="background-evnnpc" src={BG_CAMERA} />
      <div className="login-form">
        <div className="logo">
          <img alt="" src={LOGO_CAMERA} />
        </div>
        {children}
      </div>
    </div>;
}

export default (AuthBase);
