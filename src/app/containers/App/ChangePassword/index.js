import React from 'react';
import { connect } from 'react-redux';
import { Form, Row } from 'antd';

import CustomSkeleton from '@components/CustomSkeleton';
import CustomButton from '@components/CustomButton';

import { CONSTANTS, RULES } from '@constants';
import { toast } from '@app/common/functionCommons';
import { requestChangePassword } from '@app/services/User';

import * as app from '@app/store/ducks/app.duck';

import './ChangePassword.scss';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function ChangePassword({ myInfo, requiredChangePassword, isLoading, ...props }) {
  const [formChangePassword] = Form.useForm();

  async function onFinish(values) {
    const { matKhauCu, newPassword } = values;
    if (matKhauCu === newPassword) {
      return toast(CONSTANTS.WARNING, t('MK_MOI_KHONG_DUOC_TRUNG_MK_CU'));
    }

    const apiResponse = await requestChangePassword({ oldPassword: matKhauCu, newPassword });
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, t('THAY_DOI_PW_THANH_CONG'));
      formChangePassword.resetFields();
      props.clearToken();
    }
  }

  return <>
    <div id="change-password" style={{ background: '#f0f2f5' }}>
      <div className="change-password__item">
        <div className="change-password__title">
          {`${myInfo?.neverLogin ? t('DOI_MAT_KHAU_LAN_DAU') : t('DOI_MAT_KHAU')}`}
        </div>

        {requiredChangePassword && !myInfo?.neverLogin && <div className="change-password__title">
          {t('MAT_KHAU_HIEN_TAI_DA_CU')}
        </div>}
        <Form form={formChangePassword} onFinish={onFinish} className="mt-3">
          <Row>
            <CustomSkeleton
              size="default"
              label={t('MAT_KHAU_CU')} name="matKhauCu"
              layoutCol={{ xs: 24 }} labelCol={{ xs: 7 }}
              type={CONSTANTS.PASSWORD}
              rules={[RULES.REQUIRED]}
              form={formChangePassword}
            />

            <CustomSkeleton
              size="default"
              label={t('MAT_KHAU')} name="newPassword"
              type={CONSTANTS.PASSWORD}
              layoutCol={{ xs: 24 }} labelCol={{ xs: 7 }}
              rules={[RULES.REQUIRED, RULES.PASSWORD_FORMAT]}
              helpInline={false}
            />

            <CustomSkeleton
              size="default"
              label={t('NHAP_LAI_MAT_KHAU')} name="rePassword"
              type={CONSTANTS.PASSWORD}
              layoutCol={{ xs: 24 }} labelCol={{ xs: 7 }}
              dependencies={['newPassword']}
              rules={[
                RULES.REQUIRED,
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t('KHONG_KHOP_VUI_LONG_THU_LAI'));
                  },
                }),
              ]}
              helpInline={false}/>
          </Row>

          <div className="clearfix d-flex mt-2">
            <CustomButton
              className="m-auto"
              title={t('DOI_MAT_KHAU')}
              htmlType="submit"
              disabled={isLoading}
            />
          </div>
        </Form>
      </div>
    </div>

  </>;
}


function mapStateToProps(store) {
  const { permissions } = store.user;
  const { myInfo, requiredChangePassword } = store.user;
  return { permissions, myInfo, requiredChangePassword };
}

export default withTranslation()(connect(mapStateToProps, app.actions)(ChangePassword));
