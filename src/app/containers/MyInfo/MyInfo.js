import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form, Row, Tabs } from 'antd';
import { SaveFilled } from '@ant-design/icons';
import moment from 'moment';
import Cookies from 'js-cookie';
import { setCookieToken } from '@app/common/functionCommons';

import CustomSkeleton from '@components/CustomSkeleton';
import DropzoneImage from '@components/DropzoneImage';

import { CONSTANTS, GENDER_OPTIONS, RULES } from '@constants';
import { cloneObj, convertObjectToSnakeCase, toast } from '@app/common/functionCommons';
import { requestChangePassword } from '@app/services/User';

import * as user from '@app/store/ducks/user.duck';
import * as app from '@app/store/ducks/app.duck';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function MyInfo({ myInfo, isLoading, roleList, ...props }) {
  const [formInfo] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const [avatarTemp, setAvatarTemp] = useState(null);

  React.useEffect(() => {
    if (myInfo) {
      const dataField = cloneObj(myInfo);
      dataField.roleId = dataField?.roleId?.map(roleItem => roleItem?.name);
      dataField.birthday = dataField?.birthday ? moment(dataField.birthday) : '';
      dataField.name = dataField?.unitId?.name;
      formInfo.setFieldsValue(dataField);
      if (avatarTemp) setAvatarTemp(null);
    }
  }, [myInfo]);

  function handleUpdateMyInfo({ fullName, gender, email, phone }) {
    const formData = new FormData();
    formData.append('json_data', JSON.stringify(convertObjectToSnakeCase({ fullName, gender, email, phone })));
    if (avatarTemp) formData.append('avatar', avatarTemp);
    props.updateMyInfo(formData);
  }

  async function handleChangePassword({ oldPassword, newPassword }) {
    const currentRefreshToken = Cookies.get('refreshToken');
    const apiResponse = await requestChangePassword({ oldPassword, newPassword, currentRefreshToken });
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, `${t('THAY_DOI')} ${t('MAT_KHAU')} ${t('THANH_CONG')}`);
      setCookieToken('token', apiResponse.token);
      formChangePassword.resetFields();
    }
  }

  function onValuesChange(changedValues, allValues) {
    const { newPassword } = changedValues;
    if (newPassword && allValues?.confirmPassword) {
      formInfo.validateFields(['confirmPassword']);
    }
  }

  function handleSelectAvatar(files) {
    setAvatarTemp(files);
  }

  return (
    <div>
      <Tabs size="small">
        <Tabs.TabPane tab={t('THONG_TIN_CA_NHAN')} key="1">
          <Row>
            <Col sm={18}>
              <Form form={formInfo} id="form-info" autoComplete="off" onFinish={handleUpdateMyInfo}>
                <Row gutter={15}>
                  <CustomSkeleton
                    size="default"
                    label={t('TEN_DANG_NHAP')}
                    name="username"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    showInputLabel
                  />
                  <CustomSkeleton
                    size="default"
                    label={t('HO_TEN')} name="fullName"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.REQUIRED]}
                    disabled={isLoading}
                    form={formInfo}
                  />
                  <CustomSkeleton
                    size="default"
                    label={t('GIOI_TINH')} name="gender"
                    type={CONSTANTS.SELECT}
                    options={{ data: GENDER_OPTIONS }}
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    disabled={isLoading}
                  />
                  <CustomSkeleton
                    size="default"
                    label="Email" name="email"
                    type={CONSTANTS.TEXT}
                    rules={[RULES.EMAIL, RULES.REQUIRED]}
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    disabled={isLoading}
                    form={formInfo}
                  />
                  <CustomSkeleton
                    size="default"
                    label={t('SO_DIEN_THOAI')} name="phone"
                    type={CONSTANTS.TEXT}
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    rules={[RULES.PHONE]}
                    disabled={isLoading}
                    helpInline={false}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('VAI_TRO')} name="roleId"
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    type={CONSTANTS.SELECT}
                    options={{ data: roleList, labelString: 'name', valueString: 'name' }}
                    showInputLabel
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('DON_VI')} name="name"
                    labelCol={{ xs: 8 }}
                    layoutCol={{ xs: 24 }}
                    type={CONSTANTS.TEXT}
                    showInputLabel
                  />
                </Row>
              </Form>
            </Col>
            <Col sm={6}>
              <div className="attach-image">
                <div className="attach-image__title">
                  {t('ANH_DAI_DIEN')}
                </div>
                <div className="attach-image__img">
                  <DropzoneImage
                    width={38 * 5}
                    height={38 * 5}
                    imgUrl={myInfo.avatar}
                    handleDrop={handleSelectAvatar}
                    stateRerender={myInfo.avatar}
                  />
                </div>
              </div>
            </Col>

            <Col xs={24}>
              <Button
                htmlType="submit"
                form="form-info"
                type="primary" className="float-right"
                icon={<SaveFilled/>}
                disabled={isLoading}>
                {t('LUU')}
              </Button>
            </Col>
          </Row>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab={t('DOI_MAT_KHAU')} key="2">
          <Form form={formChangePassword} autoComplete="off" onFinish={handleChangePassword}
                onValuesChange={onValuesChange}>
            <Row gutter={15}>
              <CustomSkeleton
                size="default"
                label={t('MAT_KHAU_CU')} name="oldPassword"
                type={CONSTANTS.PASSWORD}
                rules={[RULES.REQUIRED]}
                layoutCol={{ xs: 24 }} labelCol={{ xs: 8 }}
                disabled={isLoading}
                helpInline={false}
              />
              <CustomSkeleton
                size="default"
                label={t('MAT_KHAU_MOI')} name="newPassword"
                type={CONSTANTS.PASSWORD}
                layoutCol={{ xs: 24 }} labelCol={{ xs: 8 }}
                rules={[RULES.REQUIRED, myInfo.isSystemAdmin ? RULES.PASSWORD_SYSADMIN_FORMAT : RULES.PASSWORD_FORMAT]}
                disabled={isLoading}
                helpInline={false}
              />
              <CustomSkeleton
                size="default"
                label={t('XAC_NHAN_MAT_KHAU_MOI')} name="confirmPassword"
                layoutCol={{ xs: 24 }} labelCol={{ xs: 8 }}
                type={CONSTANTS.PASSWORD}
                helpInline={false}
                rules={[RULES.REQUIRED,
                  ({ getFieldValue }) => ({
                    validator(rule, confirmPassword) {
                      if (confirmPassword && getFieldValue('newPassword') !== confirmPassword) {
                        return Promise.reject(t('MK_MOI_KO_TRUNG_KHOP'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                disabled={isLoading}
                form={formInfo}
              />

              <Col xs={24}>
                <Button
                  htmlType="submit"
                  type="primary" className="float-right"
                  icon={<SaveFilled/>}
                  disabled={isLoading}>
                  {t('LUU')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

function mapStateToProps(store) {
  const { myInfo } = store.user;
  const { isLoading } = store.app;
  return { isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps, { ...app.actions, ...user.actions })(MyInfo));
