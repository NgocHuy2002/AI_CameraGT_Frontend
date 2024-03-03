import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Tabs } from 'antd';
import { connect } from 'react-redux';
import { SaveFilled } from '@ant-design/icons';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

import CaiDatHeTHong from '@containers/Setting/CaiDatHeThong/CaiDatHeThong';

import { CONSTANTS } from '@constants';
import { toast } from '@app/common/functionCommons';

import * as caiDat from '@app/store/ducks/caiDat.duck';

function SettingCard({ label, children }) {
  const title = <div className="ant-card-head-title-custom require-field">{label}</div>;
  return <Card size="small" title={title}>
    {children}
  </Card>;
}

function Setting({ permission, isLoading, caiDatHeThong, ...props }) {
  const [activeKey, setActiveKey] = useState('1');
  const [trigger, setTrigger] = useState(false);

  const [isChangeForm, setChangeForm] = useState({
    heThong: false,
    ai: false,
    vanHanh: false,
    ungDungDiDong: false,
    api: false,
    ldap: false,
  });

  const [isDisableSubmit, setDisableSubmit] = useState({
    heThong: false,
    ai: false,
    vanHanh: false,
    ungDungDiDong: false,
    api: false,
    ldap: false,
  });

  const allowChange = permission.update;

  return (
    <>
      <SettingCard label={t('CAI_DAT_HE_THONG')}>
        <CaiDatHeTHong
          allowChange={allowChange}
          isChangeForm={isChangeForm.heThong}
          setChangeForm={heThong => setChangeForm(Object.assign({}, isChangeForm, { heThong }))}
          isDisableSubmit={isDisableSubmit.heThong}
          setDisableSubmit={heThong => setDisableSubmit(Object.assign({}, isDisableSubmit, { heThong }))}
          trigger={trigger} />
      </SettingCard>

      <Card size="small">
        <Row>
          {allowChange && <Col xs={24}>
            <Button
              onClick={() => {
                setTrigger(trigger => !trigger);
                toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('CAI_DAT')} ${t('THANH_CONG')}`);
              }}
              size="small"
              type="primary" className="float-right"
              disabled={(!isChangeForm.heThong && !isChangeForm.ai && !isChangeForm.vanHanh &&
                !isChangeForm.ungDungDiDong && !isChangeForm.api && !isChangeForm.ldap) ||
                isDisableSubmit.heThong || isDisableSubmit.ai || isDisableSubmit.vanHanh
                || isDisableSubmit.ungDungDiDong || isDisableSubmit.api || isDisableSubmit.ldap}
              icon={<SaveFilled />}
            >
              {t('LUU')}
            </Button>
          </Col>}
        </Row>
      </Card>
    </>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.setting;
  const { caiDatHeThong } = store.caiDat;
  const { isLoading } = store.app;
  return { permission, isLoading, caiDatHeThong };
}

export default withTranslation()(connect(mapStateToProps, { ...caiDat.actions })(Setting));
