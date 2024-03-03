import React from 'react';
import { Button, Dropdown, Form, Input, Menu, Row } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import AuthBase from '@containers/Authenticator/AuthBase';
import { toast } from '@app/common/functionCommons';

import { CONSTANTS, RULES } from '@constants';
import { URL } from '@url';

import * as app from '@app/store/ducks/app.duck';
import { withTranslation } from 'react-i18next';

function Login({ t, history, isLoading, ...props }) {
  function handleLogin(value) {
    props.login(value, history);
  }

  return <AuthBase>
    <Form size="large" layout="vertical" onFinish={handleLogin}>
      <Form.Item label={t('TAI_KHOAN')} name="username" rules={[RULES.REQUIRED]}>
        <Input placeholder={t('TAI_KHOAN')} disabled={isLoading}/>
      </Form.Item>

      <Form.Item label={t('MAT_KHAU')} name="password" rules={[RULES.REQUIRED]}>
        <Input.Password placeholder="******" disabled={isLoading}/>
      </Form.Item>
      <Row className="pt-2">
        <Button type="primary" htmlType="submit" loading={isLoading}>{t('LOGIN')}</Button>
      </Row>
    </Form>
    <div className="mt-2">
      <Link to={URL.FORGET_PASSWORD}>
        {t('QUEN_MAT_KHAU')}
      </Link>
    </div>
  </AuthBase>;
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default withTranslation()(connect(mapStateToProps, app.actions)(Login));
