import React from 'react';
import { connect } from 'react-redux';
import { Badge, Dropdown, Menu } from 'antd';

import { CONSTANTS } from '@constants';

import * as locale from '@app/store/ducks/locale.duck';

import FLAG_VN from '@assets/images/flag/VN.svg';
import FLAG_UK from '@assets/images/flag/UK.svg';
import VIETNAMESE from '@assets/images/flag/vietnamese.svg';
import ENGLAND from '@assets/images/flag/england.svg';
import { t } from 'i18next';


function MultiLanguage({ ...props }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const language = localStorage.getItem('i18nextLng');
  let flagIcon = null;
  switch (language) {
    case CONSTANTS.LANG_VI:
      flagIcon = VIETNAMESE;
      break;
    case CONSTANTS.LANG_EN:
      flagIcon = ENGLAND;
      break;
    default:
      break;
  }

  function onClick({ key }) {
    props.setLang(key);
    // forceUpdate();
    window.location.reload();
  }

  function renderOverlay() {
    return <Menu selectedKeys={[language]} onClick={onClick}>
      <Menu.Item key={CONSTANTS.LANG_VI} className="d-flex">
        <img src={FLAG_VN} alt="" width={30} height={20} className="pull-left my-auto"/>
        <span className="ml-2" style={{ lineHeight: '28px' }}>Tiếng Việt</span>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key={CONSTANTS.LANG_EN} className="d-flex">
        <img src={FLAG_UK} alt="" width={30} height={20} className="pull-left my-auto"/>
        <span className="ml-2" style={{ lineHeight: '28px' }}>English</span>
      </Menu.Item>
    </Menu>;
  }

  return (
    <Dropdown
      overlay={renderOverlay} trigger={['click']} placement="bottomRight" arrow>
      <div className="notification-container" style={{ marginRight: 10 }}>
        <div className="notification-bg"/>
        <Badge size="small">
          <img src={flagIcon} alt="" width={30}/>
        </Badge>
      </div>
    </Dropdown>
  );
}

function mapStateToProps(store) {
  const { language } = store.locale;
  return { language };
}

export default (connect(mapStateToProps, { ...locale.actions })(MultiLanguage));
