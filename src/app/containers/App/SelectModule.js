import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import CameraModuleIcon from '@components/Icons/CameraModuleIcon';
import { CONSTANTS_MODULE } from '@constants';

import * as module from '@app/store/ducks/module.duck';
import { t } from 'i18next';

function SelectModule({ permissions, isLoading, ...props }) {
  const congTrinhPermission = permissions?.construction;
  const tonTaiThietBiPermission = permissions?.tonTaiThietBi;

  const [isFirst, setFirst] = useState(true);

  useEffect(() => {
    const moduleApp = localStorage.getItem('moduleApp');
    if (moduleApp) {
      props.setModuleApp(moduleApp);
    }
    setFirst(false);
  }, []);

  function handleSelect(moduleSelected) {
    props.setModuleApp(moduleSelected);
  }

  if (isFirst) return null;

  return <div id="select-module">
    <div className="list-module">
      <div className="module-container" onClick={() => handleSelect(CONSTANTS_MODULE.QUAN_LY_CAMERA_CANH_BAO.code)}>
        <div className="module-item">
          <div className="module-item__icon">
            <CameraModuleIcon/>
          </div>
          <div className="module-item__label">
            <label>
              {t('Quản lý giám sát cảnh báo').toUpperCase()}
            </label>
          </div>
          <div className="module-item__underlined"/>
        </div>
      </div>
    </div>

  </div>;
}


function mapStateToProps(store) {
  const { permissions } = store.user;
  return { permissions };
}

export default (connect(mapStateToProps, { ...module.actions })(withRouter(SelectModule)));
