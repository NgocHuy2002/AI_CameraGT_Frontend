import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Row } from 'antd';

import CustomSkeleton from '@components/CustomSkeleton';
import CustomModal from '@components/CustomModal';

import { CONSTANTS, RULES } from '@constants';
import { convertMoment, toast } from '@app/common/functionCommons';
import { t } from 'i18next';

function TimeModal({ isLoading, ...props }) {
  const { timeName, sourceSelected } = props;
  const { dataSource, setDataSource } = props;
  const { isModalVisible, handleCancel, timeType, updateService, disabledDate } = props;

  const [formTime] = Form.useForm();

  const [title, setTitle] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    switch (timeType) {
      case CONSTANTS.CAT_DIEN:
        setTitle(t('CAT_DIEN').toLowerCase());
        break;
      case CONSTANTS.PROCESSED:
        setTitle(t('XU_LY'));
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      formTime.resetFields();
      formTime.setFieldsValue({
        [timeName]: convertMoment(sourceSelected?.[timeName]),
      });
    }
  }, [isModalVisible]);

  async function onFinish(values) {
    setLoadingModal(true);
    const apiRequest = {
      _id: sourceSelected._id,
      [timeName]: values?.[timeName],
    };
    const apiResponse = await updateService(apiRequest, false);
    if (apiResponse) {
      setDataSource(dataSource.map(doc => doc._id === apiResponse._id ? apiResponse : doc));
      handleCancel();
      toast(CONSTANTS.SUCCESS, t('MSG_CAP_NHAT_TG_THANH_CONG'));
    }
    setLoadingModal(false);
  }

  return (
    <>
      <CustomModal
        width={300}
        title={`${t('THOI_GIAN')} ${title}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        formId={`form-time-${timeType?.toLowerCase()}-${sourceSelected?._id}`}
        isLoadingSubmit={loadingModal}
        isDisabledClose={loadingModal}
      >
        <Form
          id={`form-time-${timeType?.toLowerCase()}-${sourceSelected?._id}`}
          form={formTime} onFinish={onFinish}>
          <Row>
            <CustomSkeleton
              size="default"
              name={timeName}
              itemClassName="m-0"
              layoutCol={{ xs: 24 }} labelCol={{ xs: 24 }}
              type={CONSTANTS.DATE_TIME}
              rules={[RULES.REQUIRED]}
              helpInline={false}
              disabled={loadingModal}
              {...disabledDate ? { disabledDate } : null}
            />
          </Row>
        </Form>
      </CustomModal>

    </>
  );
}


function mapStateToProps(store) {
  const permission = store.user.permissions?.user;
  const { isLoading, assignStatus } = store.app;
  const { myInfo } = store.user;
  return { permission, isLoading, assignStatus, myInfo };
}

export default (connect(mapStateToProps, null)(TimeModal));
