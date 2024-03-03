import React from 'react';
import PropTypes from 'prop-types';

import TagButton from '@components/TagButton';
import { DownloadOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
import { Tag } from 'antd';

function DownloadButton({ onClick, title, className }) {

  return <React.Fragment>
    <TagButton
      size="small"
      className={`tab-btn tab-btn-sm ${className}`}
      title={t(title)}
      color="#9900CC"
      icon={<i className="fas fa-file-download mr-2"/>}
      onClick={onClick}
    />
  </React.Fragment>;

}

export default withTranslation()(DownloadButton);

DownloadButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  className: PropTypes.string,
};

DownloadButton.defaultProps = {
  onClick: null,
  title: 'TAI_XUONG_TAP_TIN',
  className: 'tab-btn tab-btn-sm',
};
