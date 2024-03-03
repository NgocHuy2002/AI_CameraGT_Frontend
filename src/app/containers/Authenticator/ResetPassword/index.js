import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Row } from 'antd';
import { Link, useHistory, withRouter } from 'react-router-dom';
import queryString from 'query-string';

import AuthBase from '@containers/Authenticator/AuthBase';

import { requestResetPassword } from '@app/services/User';
import { CONSTANTS, RULES } from '@constants';
import { URL } from '@url';
import { toast } from '@app/common/functionCommons';

import * as app from '@app/store/ducks/app.duck';
import { t } from 'i18next';

function ResetPassword(props) {
  let history = useHistory();
  const { search } = useHistory()?.location;
  const { token } = queryString.parseUrl(search)?.query;

  const resetPassword = async values => {
    const response = await requestResetPassword(token, { password: values.password });
    if (response && response.success) {
      toast(CONSTANTS.SUCCESS, t('THAY_DOI_PW_THANH_CONG'));
      props.clearToken();
      history.push('/');
    }
  };

  return (<AuthBase>
    <Form id="formModal" size="large" layout="vertical" onFinish={resetPassword} autoComplete="new-password">
      <Form.Item label={t('MAT_KHAU_MOI')} name="password" rules={[RULES.REQUIRED, RULES.PASSWORD_FORMAT]}>
        <Input.Password placeholder={t('MAT_KHAU_MOI')}/>
      </Form.Item>
      <Form.Item label={t('NHAP_LAI_MAT_KHAU_MOI')} name="confirmPassword" rules={[
        RULES.REQUIRED,
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(t('MAT_KHAU_KHONG_KHOP'));
          },
        }),
      ]}>
        <Input.Password placeholder={t('NHAP_LAI_MAT_KHAU_MOI')}/>
      </Form.Item>
      <Row className="pt-2">
        <Button type="primary" htmlType="submit">{t('XAC_NHAN')}</Button>
      </Row>
    </Form>
    <div className="mt-2">
      <Link to={URL.LOGIN}>
        {t('QUAY_LAI')}
      </Link>
    </div>
  </AuthBase>);
}

export default (connect(null, app.actions))(withRouter(ResetPassword));
