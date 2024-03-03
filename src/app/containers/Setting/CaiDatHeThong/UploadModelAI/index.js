import React, { useEffect, useState } from 'react';
import { Progress, Tag } from 'antd';
import { connect } from 'react-redux';
import { SaveFilled, UploadOutlined } from '@ant-design/icons';

import CustomSkeleton from '@components/CustomSkeleton';
import CustomDivider from '@components/CustomDivider';

import { CONSTANTS } from '@constants';
import { cloneObj, toast } from '@app/common/functionCommons';

import * as caiDat from '@app/store/ducks/caiDat.duck';
import Dropzone from 'react-dropzone';
import { uploadFileModelAI } from '@app/services/Setting';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function UploadModelAI({ domain, isLoading, allowChange, fileType, fileName, ...props }) {
  const [fileBlob, setFileBlob] = React.useState(0);
  const [isUploaded, setUploaded] = React.useState(false);
  const [progressUpload, setProgressUpload] = React.useState(0);

  async function handleSelectFile(files) {
    if (!Array.isArray(files) || !files?.[0]) return;
    if (!isUploaded) {
      setUploaded(true);
    }
    const file = files[0];
    setFileBlob(file);


    const config = {
      onUploadProgress: function(progressEvent) {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgressUpload(percentCompleted === 100 ? 99 : percentCompleted);
      },
    };

    const apiResponse = await uploadFileModelAI(domain, file, config);
    if (apiResponse) {
      setProgressUpload(100);
      props.setCaiDatHeThong(apiResponse);
      toast(CONSTANTS.SUCCESS, t('TAI_LEN_THANH_CONG'));
    } else {
      toast(CONSTANTS.ERROR, t('TAI_LEN_THAT_BAI'));
    }
    setUploaded(false);
  }

  return (
    <div className="flex-row">

      <div style={{ flex: 'auto', alignSelf: 'center' }}>
        {fileBlob?.name || fileName}
      </div>

      {isUploaded && <div className="ml-2">
        <div style={{ width: 30, height: 30, display: 'flex' }}>
          {(progressUpload < 100)
            ? <Progress
              type="circle" className="my-auto"
              percent={progressUpload}
              showInfo={false}
              strokeWidth={20}
              width={25}/>
            : <i className="fas fa-check-circle my-auto" style={{ fontSize: 25, color: '#52c41a' }}/>}
        </div>
      </div>}

      {allowChange && <div>
        <Dropzone
          multiple={false}
          disabled={isLoading || (!!progressUpload && progressUpload < 100)}
          // maxSize={104857600}
          onDrop={files => handleSelectFile(files)}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} >
              <input {...getInputProps()} />
              <Tag
                className="tab-btn m-0"
                icon={<UploadOutlined/>} color="blue">
                {t('CHON_TAP_TIN')}
              </Tag>
            </div>
          )}
        </Dropzone>
      </div>}
    </div>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default withTranslation()(connect(mapStateToProps, { ...caiDat.actions })(UploadModelAI));


