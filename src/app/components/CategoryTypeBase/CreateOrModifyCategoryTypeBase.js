import React, { useEffect } from 'react';
import { Form, Row } from 'antd';

import Loading from '@components/Loading';
import CustomSkeleton from '@components/CustomSkeleton';
import CustomModal from '@components/CustomModal';

import { CONSTANTS, RULES } from '@constants';
import CustomColorPicker from '@components/CustomColorPicker';
import { t } from 'i18next';

function CreateOrModifyCategoryTypeBase({ categoryTypeBaseSelected, ...props }) {
  const { isModalVisible, handleOk, handleCancel, permission } = props;

  const { titleBase } = props;

  const allowChange = (permission.create && !categoryTypeBaseSelected?._id) || (permission.update && categoryTypeBaseSelected?._id);

  const [formCategoryTypeBase] = Form.useForm();

  useEffect(() => {
    if (categoryTypeBaseSelected && isModalVisible) {
      formCategoryTypeBase.setFieldsValue(categoryTypeBaseSelected);
    } else if (!isModalVisible) {
      formCategoryTypeBase.resetFields();
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    data.color = data.color?.hex;
    handleOk(categoryTypeBaseSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, data);
  }

  return (
    <>
      <CustomModal
        width="520px" maskClosable={!allowChange}
        title={categoryTypeBaseSelected
          ? permission.update ? `${t('CAP_NHAT')} ${titleBase.toLowerCase()}` : `${t('CHI_TIET')} ${titleBase.toLowerCase()}`
          : `${t('THEM_MOI')} ${titleBase.toLowerCase()}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        formId="form-modal"
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
        showFooter={allowChange}
      >
        <Loading active={props.isLoading}>
          <Form id="form-modal" form={formCategoryTypeBase} size="default" onFinish={onFinish}>
            <Row gutter={15}>
              <CustomSkeleton
                size="default"
                label={t('CAP_DIEN_AP')} name="tenLoai"
                layoutCol={{ xs: 24 }} labelCol={{ xs: 6 }}
                type={CONSTANTS.TEXT}
                rules={[RULES.REQUIRED]}
                form={formCategoryTypeBase}
                showInputLabel={!allowChange}
              />

              <CustomSkeleton
                size="default"
                label={t('THU_TU')} name="thuTu"
                layoutCol={{ xs: 24 }} labelCol={{ xs: 6 }}
                type={CONSTANTS.NUMBER}
                min={1}
                showInputLabel={!allowChange}
              />

              <CustomSkeleton
                size="default"
                style={{ zIndex: 2 }}
                label={t('MAU_TREN_BAN_DO')} name="color"
                layoutCol={{ xs: 24 }} labelCol={{ xs: 6 }}
              >
                <CustomColorPicker disabled={!allowChange}/>
              </CustomSkeleton>

              <CustomSkeleton
                size="default"
                label={t('GHI_CHU')} name="ghiChu"
                layoutCol={{ xs: 24 }} labelCol={{ xs: 6 }}
                type={CONSTANTS.TEXT_AREA}
                autoSize={{ minRows: 2, maxRows: 5 }}
                form={formCategoryTypeBase}
                showInputLabel={!allowChange}
              />
            </Row>
          </Form>
        </Loading>
      </CustomModal>
    </>
  );
}

export default CreateOrModifyCategoryTypeBase;
