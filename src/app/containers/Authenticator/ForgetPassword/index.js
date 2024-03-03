import React from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { Button, Form, Input, Row } from 'antd';

import AuthBase from '@containers/Authenticator/AuthBase';

import { requestForgetPassword } from '@app/services/User';
import { URL } from '@url';
import { CONSTANTS, RULES } from '@constants';
import { toast } from '@app/common/functionCommons';
import { t } from 'i18next';

function ForgetPassword() {
  let history = useHistory();

  async function forgetPassword(values) {
    const response = await requestForgetPassword(values);
    if (response.success) {
      toast(CONSTANTS.SUCCESS, t('HE_THONG_DA_GUI_MAIL_XAC_NHAN'));
      history.push('/');
    } else {
      toast(CONSTANTS.WARNING, t('CO_LOI_KHI_GUI_MAIL'));
    }
  }

  return (<AuthBase>
      <Form id="formModal" size="large" layout="vertical" onFinish={forgetPassword} autoComplete="new-password">
        <Form.Item label="Email" name="email" rules={[RULES.REQUIRED, RULES.EMAIL]}>
          <Input placeholder="Email"/>
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
    </AuthBase>
  );
}

export default withRouter(ForgetPassword);
