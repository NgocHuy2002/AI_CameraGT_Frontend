import React, { useEffect, useState } from 'react';
import { Col,Form, Row } from 'antd';
import { connect } from 'react-redux';

import Loading from '@components/Loading';
import CustomModal from '@components/CustomModal';
import CustomSkeleton from '@components/CustomSkeleton';

import { CONSTANTS, RULES } from '@constants';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function CreateOrModifyCameraType({ isModalVisible, handleOk, handleCancel, itemSelected, myInfo, ...props}) {
  const { permission } = props;

  const allowChange = (permission.create && !itemSelected?._id) || (permission.update && !!itemSelected?._id);

  const [formCameraType] = Form.useForm();
  useEffect(() => {
    if (isModalVisible) {
      formCameraType.resetFields();
      if(itemSelected){
        formCameraType.setFieldsValue(itemSelected);
      }
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    const dataRequest = { ...data };
    handleOk(itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, dataRequest);
  }

  return (<>
    <CustomModal
      width="920px"
      title={itemSelected ? t('UPDATE_CAMERA_TYPE') : t('CREATE_CAMERA_TYPE')}
      visible={isModalVisible}
      onCancel={handleCancel}
      isLoadingSubmit={props.isLoading}
      isDisabledClose={props.isLoading}
      formId="form-camera-type"
      showFooter={!!allowChange}
      maskClosable={!allowChange}
    >
      <Loading active={props.isLoading}>
        <Row>
          <Col xs={24} md={24}>
            <Form
              id="form-camera-type" size="default"
              form={formCameraType}
              onFinish={onFinish}
            >
              <Row>

                <CustomSkeleton
                  size="default"
                  label={t('BRAND_CAMERA')} name="brand"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24 }}
                  labelCol={{ xs: 6, md: 6, lg: 5 }}
                  rules={[RULES.REQUIRED]}
                  form={formCameraType}
                  showInputLabel={!allowChange}
                />

                <CustomSkeleton
                  size="default"
                  label={t('DESCRIPTION')} name="description"
                  type={CONSTANTS.TEXT_AREA}
                  layoutCol={{ xs: 24 }}
                  labelCol={{ xs: 6, md: 6, lg: 5 }}
                  form={formCameraType}
                  showInputLabel={!allowChange}
                />

                {myInfo.isSystemAdmin &&
                  <CustomSkeleton
                    size="default"
                    label={t('Format RTSP')} name="formatRtsp"
                    type={CONSTANTS.TEXT_AREA}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    form={formCameraType}
                  />
                }

              </Row>
            </Form>
          </Col>
        </Row>
      </Loading>
    </CustomModal>
  </>);
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(CreateOrModifyCameraType));
