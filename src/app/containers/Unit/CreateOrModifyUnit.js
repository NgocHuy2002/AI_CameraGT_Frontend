import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'antd';
import { connect } from 'react-redux';

import Loading from '@components/Loading';
import CustomModal from '@components/CustomModal';
import CustomSkeleton from '@components/CustomSkeleton';

import { CONSTANTS, RULES, ORG_UNIT_TYPE } from '@constants';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

import { cloneObj, paginationConfig, randomKey, toast } from '@app/common/functionCommons';
import * as unit from '@app/store/ducks/unit.duck';

function CreateOrModifyUnit({ isModalVisible, handleOk, handleCancel, itemSelected, myOrgUnit, unitList, ...props }) {
  const { permission } = props;
  const allowChange = (permission.create && !itemSelected?._id) || (permission.update && !!itemSelected?._id);
  const [formUnit] = Form.useForm();

  const [parentKey, setParentKey] = useState(false);

  useEffect(() => {
    if (!unitList) {
      props.getAllUnit();
    }

  }, []);

  useEffect(() => {
    if (isModalVisible) {
      formUnit.resetFields();
      if (itemSelected) {
        formUnit.setFieldsValue(itemSelected);
      }
    }
  }, [isModalVisible]);

  useEffect(() => {
    formUnit.resetFields();
    const fieldData = handleDataDetail(itemSelected);
    formUnit.setFieldsValue(fieldData);
  }, [itemSelected]);

  function handleDataDetail(dataInput) {
    const fieldData = cloneObj(dataInput);
    const capDonViObject = Object.values(ORG_UNIT_TYPE).find(unit => unit.value === fieldData?.level);
    if (capDonViObject?.label) {
      fieldData.levelName = t(capDonViObject.value);
    }
    if (fieldData?.parentId?._id) {
      fieldData.parentId = itemSelected.parentId._id;
      fieldData.parentName = itemSelected.parentId.name;
    }
    return fieldData;
  }

  function onFinish(data) {
    if (props.isLoading) return;
    const dataRequest = { ...data };
    handleOk(itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, dataRequest);
  }

  function handleChangeOrgUnitType(value, option) {
    if (parentKey !== option?.extra?.parentKey) {
      setParentKey(option?.extra?.parentKey);
      formUnit.resetFields(['parentId', 'parentName']);
    }
  }

  function checkAllowUpdateOrgUnitType() {
    if (!allowChange) return false;
    if (!itemSelected?._id) return true;
    const orgUnitTypeSelected = Object.values(ORG_UNIT_TYPE).find(unit => unit.value === itemSelected?.level);
    return myOrgUnit.level < orgUnitTypeSelected.level;
  }

  const orgUnitOptions = unitList ? unitList.filter(unit => unit?.level === parentKey).filter(unit => unit._id !== itemSelected?._id) : [];

  return (<>
    <CustomModal
      width="920px"
      title={itemSelected ? t('UPDATE_UNIT') : t('CREATE_UNIT')}
      visible={isModalVisible}
      onCancel={handleCancel}
      isLoadingSubmit={props.isLoading}
      isDisabledClose={props.isLoading}
      formId="form-unit"
      showFooter={!!allowChange}
      maskClosable={!allowChange}
    >
      <Loading active={props.isLoading}>
        <Row>
          <Col xs={24} md={24}>
            <Form
              id="form-unit" size="default"
              form={formUnit}
              onFinish={onFinish}
            >
              <Row gutter={16}>
                <CustomSkeleton
                  size="default"
                  label={t('UNIT_NAME')} name="name"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                  rules={[RULES.REQUIRED]}
                  form={formUnit}
                  showInputLabel={!allowChange}
                />
                <CustomSkeleton
                  size="default"
                  label={t('Mã đơn vị')} name="code"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                  rules={[RULES.REQUIRED]}
                  form={formUnit}
                  showInputLabel={!allowChange}
                />

                {checkAllowUpdateOrgUnitType()
                  ?
                  <CustomSkeleton
                    size="default"
                    label={t('CAP_DON_VI')} name="level"
                    type={CONSTANTS.SELECT}
                    layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                    labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                    options={{ data: Object.values(ORG_UNIT_TYPE).filter(orgUnit => orgUnit?.level > myOrgUnit?.level) }}
                    rules={[RULES.REQUIRED]}
                    showSearch
                    onChange={handleChangeOrgUnitType}
                  />
                  :
                  <CustomSkeleton
                    size="default"
                    showInputLabel
                    label={t('CAP_DON_VI')} name="levelName"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                    labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                  />}

                {
                  parentKey && <>
                    {allowChange && orgUnitOptions.length
                      ? <CustomSkeleton
                        size="default"
                        label={t('DON_VI_CHA')} name="parentId"
                        type={CONSTANTS.SELECT}
                        allowClear
                        layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                        labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                        options={{ data: orgUnitOptions, valueString: '_id', labelString: 'name' }}
                        rules={[RULES.REQUIRED]}
                        showSearch
                      />
                      : <CustomSkeleton
                        size="default"
                        label={t('DON_VI_CHA')} name="parentName"
                        layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                        labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                        type={CONSTANTS.TEXT}
                        showInputLabel={true}
                      />}
                  </>
                }

                <CustomSkeleton
                  size="default"
                  label={t('UNIT_PHONE')} name="phone"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                  form={formUnit}
                  showInputLabel={!allowChange}
                  rules={[RULES.PHONE]}
                  helpInline={false}
                />

                <CustomSkeleton
                  size="default"
                  label={t('UNIT_EMAIL')} name="email"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 8, xxl: 6 }}
                  form={formUnit}
                  showInputLabel={!allowChange}
                  rules={[RULES.EMAIL]}
                  helpInline={false}
                />

                <CustomSkeleton
                  size="default"
                  label={t('UNIT_ADDRESS')} name="address"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 4, xl: 4, xxl: 3 }}
                  // rules={[RULES.REQUIRED]}
                  form={formUnit}
                  showInputLabel={!allowChange}
                />

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
  const { unitList } = store.unit;
  const myOrgUnit = Object.values(ORG_UNIT_TYPE).find(unit => unit.value === myInfo?.unitId?.level);
  return { isLoading, myInfo, myOrgUnit, unitList };
}

export default withTranslation()(connect(mapStateToProps, { ...unit.actions })(CreateOrModifyUnit));
