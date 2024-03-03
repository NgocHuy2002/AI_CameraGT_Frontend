import React, { useState } from 'react';
import { connect } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';

import TagButton from '@components/TagButton';
import { CONSTANTS } from '@constants';
import { t } from 'i18next';

function DownloadTapTin({ isLoading, type, handleDownload, ...props }) {
  const [loadingDownload, setLoadingDownload] = useState(false);

  async function onClick() {
    if (isLoading || loadingDownload) return;
    await setLoadingDownload(true);
    await handleDownload();
    await setLoadingDownload(false);
  }

  let color = '', title = '', icon = null;
  switch (type) {
    case CONSTANTS.DOCX:
      title = '.docx';
      color = '#108EE9FF';
      icon = <i className="far fa-file-word mr-2"/>;
      break;
    case CONSTANTS.PDF:
      title = '.pdf';
      color = '#cd201f';
      icon = <i className="far fa-file-pdf mr-2"/>;
      break;
    case CONSTANTS.XLSX:
      title = '.xlsx';
      color = '#87d068';
      icon = <i className="far fa-file-excel mr-2"/>;
      break;
    default:
      break;
  }

  return <>
    <TagButton
      title={<>
        {title}
        {loadingDownload && <LoadingOutlined className="ml-2"/>}
      </>}
      size="small" className="font-italic"
      color={color}
      icon={icon}
      tooltipTitle={t('TAI_XUONG_TAP_TIN')}
      onClick={onClick}
      disabled={isLoading}
      style={loadingDownload ? { cursor: 'no-drop' } : {}}
    />
  </>;
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}


export default connect(mapStateToProps)(DownloadTapTin);
