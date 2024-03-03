import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Row, Col } from 'antd';
import { t } from 'i18next';

import CustomSkeleton from '@components/CustomSkeleton';

import { CONSTANTS, RULES } from '@constants';
import { updateSetting } from '@app/services/Setting';
import { cloneObj, convertObjToSnakeCase } from '@app/common/functionCommons';

import * as caiDat from '@app/store/ducks/caiDat.duck';
import QRCode from 'qrcode.react';


function CaiDatHeThong({ isLoading, allowChange, caiDatHeThong, ...props }) {
  const [formCaiDatHeThong] = Form.useForm();
  const [isFirst, setFirst] = useState(true);
  const [kichHoatAutoXoaAnh, setKichHoatAutoXoaAnh] = useState(false);

  const [ sendEmail, setSendEmail ] = useState(false);
  const { isChangeForm, setChangeForm } = props;
  const { isDisableSubmit, setDisableSubmit } = props;

  useEffect(() => {
    (async () => {
      await setFirst(true);
      await getDataCaiDatHeThong();
    })();
  }, []);

  useEffect(() => {
    if (!isFirst && isChangeForm) {
      handleSaveData();
    }
  }, [props.trigger]);

  useEffect(() => {
    const phienAutoXoaAnh = formCaiDatHeThong.getFieldValue('phienAutoXoaAnh');
    formCaiDatHeThong.resetFields(['phienAutoXoaAnh']);
    formCaiDatHeThong.setFieldsValue({ phienAutoXoaAnh });
    formCaiDatHeThong.validateFields(['phienAutoXoaAnh']);
    checkValid();
  }, [kichHoatAutoXoaAnh]);

  async function getDataCaiDatHeThong() {
    const dataField = cloneObj(caiDatHeThong);
    formCaiDatHeThong.setFieldsValue(dataField);
    setSendEmail(dataField.sendEmail || false);
    setKichHoatAutoXoaAnh(dataField.kichHoatAutoXoaAnh);
    setFirst(false);
  }

  async function handleSaveData() {
    let values = formCaiDatHeThong.getFieldsValue();
    if (!values.phienAutoXoaAnh) values.phienAutoXoaAnh = 0;
    if (!values.donViXoaAnh) values.donViXoaAnh = 'd';

    let apiRequest = convertObjToSnakeCase(values);
    apiRequest.sendEmail = sendEmail;
    let apiResponse = null;
    if (Object.keys(apiRequest).length > 0) apiResponse = await updateSetting(apiRequest);
    if (apiResponse) {
      props.setCaiDatHeThong(apiResponse);
      setChangeForm(false);
    }
  }

  function onValuesChange(changedValues) {
    if (!isChangeForm) {
      setChangeForm(true);
    }
    if (changedValues.hasOwnProperty('phienAutoXoaAnh')) checkValid();
  }

  function checkValid() {
    const phienAutoXoaAnh = formCaiDatHeThong.getFieldsValue()?.phienAutoXoaAnh;

    if (!isDisableSubmit && kichHoatAutoXoaAnh && !Number.isInteger(phienAutoXoaAnh)) {
      setDisableSubmit(true);
    } else if (isDisableSubmit) {
      setDisableSubmit(false);
    }

  }

  return (
    <Form form={formCaiDatHeThong} onValuesChange={onValuesChange} autoComplete="off">
      <Row gutter={15}>

        <CustomSkeleton
          size="default"
          label={t('THOI_GIAN_DANG_NHAP')} name="phienDangNhap"
          type={CONSTANTS.NUMBER}
          labelCol={{ xs: 12 }} layoutCol={{ xs: 12 }}
          min={1}
          helpInline={false}
          disabled={isLoading}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        />

        <CustomSkeleton
          size="default"
          name="donViDangNhap"
          type={CONSTANTS.SELECT}
          labelCol={{ xs: { span: 0 }, md: { span: 0 } }}
          layoutCol={{ xs: 4, md: 4 }}
          options={{
            data: [
              { label: t('GIO'), value: 'h', code: 'h' },
              { label: t('NGAY'), value: 'd', code: 'd' },
            ],
          }}
          disabled={isLoading}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        />

        {/* <CustomSkeleton
          size="default"
          label={t('THOI_GIAN_HET_PHIEN_RESET_MAT_KHAU')} name="phienReset"
          type={CONSTANTS.NUMBER}
          labelCol={{ xs: 15 }}
          layoutCol={{ xs: 12 }}
          min={1}
          disabled={isLoading}
          helpInline={false}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        />
        <CustomSkeleton
          size="default"
          name="donViReset"
          type={CONSTANTS.SELECT}
          labelCol={{ xs: { span: 0 }, md: { span: 0 } }}
          layoutCol={{ xs: 12, md: 4 }}
          options={{
            data: [
              { label: t('GIO'), value: 'h', code: 'h' },
              { label: t('PHUT'), value: 'm', code: 'm' },
            ],
          }}
          disabled={isLoading}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        /> */}

        <CustomSkeleton
          size="default"
          label={t('THOI_GIAN_BAT_DUOC_DOI_MK')} name="phienDoiMatKhau"
          type={CONSTANTS.NUMBER}
          labelCol={{ xs: 12 }}
          layoutCol={{ xs: 12 }}
          min={1}
          disabled={isLoading}
          helpInline={false}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        />
        <CustomSkeleton
          size="default"
          name="donViDoiMatKhau"
          type={CONSTANTS.SELECT}
          labelCol={{ xs: { span: 0 }, md: { span: 0 } }}
          layoutCol={{ xs: 12, md: 4 }}
          options={{
            data: [
              { label: t('NGAY'), value: 'd', code: 'd' },
            ],
          }}
          disabled={isLoading}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        />

        <CustomSkeleton
          size="default"
          name="donViDoiMatKhau"
          type={CONSTANTS.SELECT}
          labelCol={{ xs: { span: 0 }, md: { span: 0 } }}
          layoutCol={{ xs: 12, md: 4 }}
          options={{
            data: [
              { label: t('NGAY'), value: 'd', code: 'd' },
            ],
          }}
          disabled={isLoading}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
        />
        <CustomSkeleton
          size="default"
          label={t('SEND_EMAIL')}
          name="sendEmail"
          labelCol={{ xs: 6 }}
          layoutCol={{ xs: 24 }}
          checked={sendEmail}
          type={CONSTANTS.SWITCH}
          disabled={isLoading}
          onChange={(value) => {
            setSendEmail(value);
          }}
          showInputLabel={!allowChange}
        />

        {/* <CustomSkeleton
          size="default"
          label={t('Link tải app Android')} name="linkAndroidApp"
          type={CONSTANTS.TEXT}
          labelCol={{ xs: 6 }}
          layoutCol={{ xs: 24 }}
          disabled={isLoading}
          helpInline={false}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
          style={{marginLeft : '-3px'}}
        />
        <CustomSkeleton
          size="default"
          label={t('Link tải app Ios')} name="linkIosApp"
          type={CONSTANTS.TEXT}
          labelCol={{ xs: 6 }}
          layoutCol={{ xs: 24 }}
          disabled={isLoading}
          helpInline={false}
          isShowSkeleton={isFirst}
          showInputLabel={!allowChange}
          style={{marginLeft : '-3px'}}
        />

        <Col span={12}>
          <div style={{ textAlign: 'center', display:'inline-grid' }}>
            <div>
              <QRCode
                id='qrcodeAndroid'
                value='https://play.google.com/store/apps/details?id=vn.thinklabs.tCameraAI'
                size={290}
                level={'H'}
                includeMargin={true}
              />
            </div>
            <span>
              <b>QRCode tải app Android</b>
            </span>
          </div>
        </Col>

        <Col span={12}>
          <div style={{ textAlign: 'center', display:'inline-grid' }}>
            <div>
              <QRCode
                id='qrcodeIos'
                value='https://apps.apple.com/us/app/tcamera-ai/id6470958005'
                size={290}
                level={'H'}
                includeMargin={true}
              />
            </div>
            <span>
              <b>QRCode tải app IOS</b>
            </span>
          </div>
        </Col> */}
      </Row>
    </Form>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { caiDatHeThong } = store.caiDat;
  return { isLoading, caiDatHeThong };
}

export default (connect(mapStateToProps, caiDat.actions)(CaiDatHeThong));
