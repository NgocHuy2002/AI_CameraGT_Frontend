import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Col, Collapse, Form, Radio, Row, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { camelCase } from 'lodash';

import Loading from '@components/Loading';
import CustomModal from '@components/CustomModal';
import CustomSkeleton from '@components/CustomSkeleton';
import AddNewButton from '@AddNewButton';
import TagAction from '@components/TagAction';
import TreeUnit from '@components/TreeUnit';

import AnhDinhKem from '@containers/User/AnhDinhKem';

import * as unit from '@app/store/ducks/unit.duck';

import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';
import { ACTIONS, RESOURCES } from '@app/rbac/commons';
import { cloneObj, formatFormDataExtra, formatTypeSkeletonExtraData, toast } from '@app/common/functionCommons';
import { getInfoHrms } from '@app/services/User';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function CreateOrModifyUser({
                              myInfo,
                              myPermissions,
                              isModalVisible,
                              handleOk,
                              handleCancel,
                              userSelected,
                              unitList,
                              ...props
                            }) {
  const { permission, roleList } = props;
  const [formUser] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  const [permissionSelected, setPermissions] = useState(null);

  const [stateRerender, setStateRerender] = useState(0);

  useEffect(() => {
    if(!unitList){
      props.getAllUnit();
    }
  }, []);
  
  useEffect(() => {
    if (isModalVisible) {
      formUser.resetFields();
      if (userSelected) {
        handleDataUserSelected();
      } else {
        setPermissions(null);
        formUser.setFieldsValue({ active: true });
      }
      setStateRerender(stateRerender + 1);
    } else {
      setAvatar(null);
    }
  }, [isModalVisible]);

  async function handleDataUserSelected() {
    const dataField = {...userSelected};
    dataField.roleId = dataField.roleId.map(roleItem => roleItem?._id);
    dataField.unitId = dataField.unitId._id;
    formUser.setFieldsValue(dataField);
    setPermissions(userSelected.permissions);
  }

  function onValuesChange(changedValues) {
    
  }

  function onFinish(data) {
    if (props.isLoading) return;
    const dataRequest = { ...data, permissions: permissionSelected };
    if (avatar) {
      dataRequest.avatar = avatar;
    }
    handleOk(userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, dataRequest);
  }

  const userSelectedPermissions = Array.isArray(permissionSelected) ? permissionSelected : [];
  const allowChange = (permission.create && !userSelected?._id) || (permission.update && !!userSelected?._id);

  return (<>
    <CustomModal
      width="920px" maskClosable={!allowChange}
      title={userSelected ? t('CAP_NHAT_THONG_TIN_NGUOI_DUNG') : t('THEM_MOI_NGUOI_DUNG')}
      visible={isModalVisible}
      onCancel={handleCancel}
      isLoadingSubmit={props.isLoading}
      isDisabledClose={props.isLoading}
      showFooter={!!allowChange}
      formId="form-user"
    >
      <Loading active={props.isLoading}>
        <Row>
          <Col xs={24} md={18}>
            <Form
              id="form-user" size="default"
              autoComplete="new-password"
              form={formUser}
              onFinish={onFinish}
              onValuesChange={onValuesChange}
            >
              <Row>
                <Row className="w-100">
                  <CustomSkeleton
                    size="default"
                    label={t('TAI_KHOAN')} name="username"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24, md: 18, lg: 15 }}
                    labelCol={{ xs: 6, md: 8, lg: 8 }}
                    rules={[RULES.REQUIRED]}
                    form={formUser}
                    showInputLabel={!allowChange}
                    helpInline={false}
                  />
                </Row>
                {props.type === CONSTANTS.CREATE && <>
                  <CustomSkeleton
                    size="default"
                    label={t('MAT_KHAU')} name="password"
                    type={CONSTANTS.PASSWORD}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED, RULES.PASSWORD_FORMAT]}
                    helpInline={false}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('NHAP_LAI_MAT_KHAU')} name="rePassword"
                    type={CONSTANTS.PASSWORD}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    dependencies={['password']}
                    rules={[
                      RULES.REQUIRED,
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(t('KHONG_KHOP_VUI_LONG_THU_LAI'));
                        },
                      }),
                    ]}
                    helpInline={false}/>
                </>}

                <CustomSkeleton
                  size="default"
                  label={t('HO_TEN')} name="fullName"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24 }}
                  labelCol={{ xs: 6, md: 6, lg: 5 }}
                  rules={[RULES.REQUIRED]}
                  showInputLabel={!allowChange}
                  form={formUser}
                />

                <CustomSkeleton
                  size="default"
                  label={t('SO_DIEN_THOAI')} name="phone"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, md: 12 }}
                  labelCol={{ xs: 6, md: 12, lg: 10 }}
                  rules={[RULES.PHONE]}
                  form={formUser}
                  helpInline={false}
                  showInputLabel={!allowChange}
                />

                <CustomSkeleton
                  size="default" className="pl-md-3"
                  label={t('GIOI_TINH')} name="gender"
                  type={CONSTANTS.SELECT}
                  layoutCol={{ xs: 24, md: 12 }}
                  labelCol={{ xs: 6, md: 7 }}
                  options={{ data: GENDER_OPTIONS }}
                  showInputLabel={!allowChange}
                />

                {!userSelected?.isSystemAdmin && <>
                  {allowChange
                    ? <CustomSkeleton
                      size="default"
                      label={t('UNIT')} name="unitId"
                      labelCol={{ xs: 6, md: 6, lg: 5 }}
                      layoutCol={{ xs: 24 }}
                      type={CONSTANTS.SELECT}
                      options={{ data: unitList, labelString: 'name', valueString: '_id', valueDB: 'name' }}
                      rules={[RULES.REQUIRED]}
                      showInputLabel={!allowChange}
                      helpInline={false}
                    />
                    : <CustomSkeleton
                      size="default"
                      label={t('UNIT')}
                      labelCol={{ xs: 6, md: 6, lg: 5 }}
                      layoutCol={{ xs: 24 }}
                      type={CONSTANTS.TEXT}
                      showInputLabel
                      value={userSelected?.unitId.name}
                    />}
                  {allowChange
                    ? <CustomSkeleton
                      size="default"
                      label={t('VAI_TRO')} name="roleId"
                      labelCol={{ xs: 6, md: 6, lg: 5 }}
                      layoutCol={{ xs: 24 }}
                      type={CONSTANTS.SELECT}
                      options={{ data: roleList, labelString: 'name', valueString: '_id', valueDB: 'name' }}
                      rules={[RULES.REQUIRED]}
                      showInputLabel={!allowChange}
                      helpInline={false}
                    />
                    : <CustomSkeleton
                      size="default"
                      label={t('VAI_TRO')}
                      labelCol={{ xs: 6, md: 6, lg: 5 }}
                      layoutCol={{ xs: 24 }}
                      type={CONSTANTS.TEXT}
                      showInputLabel
                      value={userSelected?.roleId.map(role => role.name).join(', ')}
                    />}
                </>}

                <CustomSkeleton
                  size="default"
                  label={t('CHUC_VU')} name="chucVu"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24 }} labelCol={{ xs: 6, md: 6, lg: 5 }}
                  form={formUser}
                  helpInline={false}
                  showInputLabel={!allowChange}
                />

                <CustomSkeleton
                  size="default"
                  label="Email" name="email"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24 }} labelCol={{ xs: 6, md: 6, lg: 5 }}
                  rules={[RULES.EMAIL, RULES.REQUIRED]}
                  form={formUser}
                  helpInline={false}
                  showInputLabel={!allowChange}
                />

                <CustomSkeleton
                  size="default"
                  label={t('HOAT_DONG')} name="active"
                  type={CONSTANTS.SWITCH}
                  layoutCol={{ xs: 24 }} labelCol={{ xs: 6, md: 6, lg: 5 }}
                  showInputLabel={!allowChange}
                />
              </Row>
            </Form>
          </Col>

          <Col xs={24} md={6}>
            <AnhDinhKem
              allowChange={allowChange}
              avatarUrl={userSelected?.avatar}
              handleSelectAvatar={setAvatar}
              stateRerender={stateRerender}
            />
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
  const myPermissions = store.user.permissions;
  return { myPermissions, myInfo, unitList, isLoading };
}

const mapDispatchToProps = {
  ...unit.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CreateOrModifyUser));
