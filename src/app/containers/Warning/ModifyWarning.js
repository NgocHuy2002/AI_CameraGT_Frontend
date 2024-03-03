import React, { useEffect, useState, useRef } from 'react';
import { Col, Form, Row, Image, Radio, Space, Button, Select } from 'antd';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Loading from '@components/Loading';
import CustomSkeleton from '@components/CustomSkeleton';
import { URL } from '@url';
import { CONSTANTS, RULES, CONFIRM, OBJECT } from '@constants';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
import DropzoneImage from '@components/DropzoneImage';
import { getAllUserIncludedDeletedUnit } from '../../services/User';
import { getWarningById, updateWarningById } from '../../services/Warning';
import { toast, formatDateTime } from '@app/common/functionCommons';

function ModifyWarning({ ...props }) {
  const { myInfo } = props;
  let { id } = useParams();

  const [warningInfo, setWarningInfo] = useState({});

  const [showView, setShowView] = useState({
    checkStatus: false,
    checkResult: false,
    assignUsers: false,
  });

  const [valueRadio, setValueRadio] = useState('');

  const [listUser, setListUser] = useState([]);

  const [arrSelect, setArrSelect] = useState([]);

  const allowChange = true;

  const [formWarning] = Form.useForm();

  useEffect(() => {
    getDataWarningID();
    getAllUser();
  }, []);

  useEffect(() => {
    getDataWarningID();
  }, [id]);

  async function getAllUser() {
    const res = await getAllUserIncludedDeletedUnit(1, 0, {});
    if (res.length > 0) {
      setListUser(res);
    }
  }

  async function getDataWarningID() {
    const apiResponse = await getWarningById(id);
    if (apiResponse) {
      setWarningInfo(apiResponse);

      formWarning.resetFields();
      if (apiResponse) {
        formWarning.setFieldsValue({
          ...apiResponse,
          warningContent: apiResponse?.content || '',
          dectectTime: formatDateTime(apiResponse?.dectectTime),
          createdAt: formatDateTime(apiResponse?.createdAt),
          nameCamera: apiResponse?.cameraId?.name || '',
          position: apiResponse?.cameraId?.positionId?.name || '',
          powerline: apiResponse?.cameraId?.powerlineId?.name || '',
          unit: apiResponse?.cameraId?.unitId?.name || '',
        });

        setValueRadio(apiResponse?.confirmStatus || '')
        setArrSelect(apiResponse?.assignUsers || []);
        setShowView({
          checkResult: !!apiResponse.checkStatus,
          checkStatus: apiResponse.confirmStatus === CONFIRM.CANH_BAO_DUNG.code,
          assignUsers: apiResponse.confirmStatus === CONFIRM.CANH_BAO_DUNG.code,
        })
      }
    }
  }

  async function handleSaveData() {
    let values = formWarning.getFieldsValue();
    const dataUpdate = {
      checkResult: values.checkResult || '',
      checkStatus: values.checkStatus || false,
      confirmStatus: valueRadio,
      assignUsers: arrSelect || [],
    }

    const apiResponse = await updateWarningById(warningInfo._id, dataUpdate);
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('WARNING')} ${t('THANH_CONG')}`);
    }
  }


  function onValuesChange(changedValues, allValues) {
    let objShowView = { ...showView }
    if (changedValues['checkStatus'] === true) {
      objShowView.checkResult = true;
      formWarning.setFieldsValue(conventData(allValues));

      setShowView(objShowView);
    }
    if (changedValues['checkStatus'] === false) {
      objShowView.checkResult = false;
      formWarning.setFieldsValue(conventData(allValues));

      setShowView(objShowView);
    }
  }

  function conventData(objData) {
    if (objData.checkStatus !== warningInfo.checkStatus) {
      return {
        ...objData,
        checkResult: warningInfo?.checkResult || ''
      }
    } else {
      if (!objData.checkStatus) {
        return {
          ...objData,
          checkResult: ''
        }
      }
    }
    return objData
  }

  const onChangeRadio = ({ target: { value } }) => {
    setValueRadio(value);
    const allFormValues = formWarning.getFieldsValue();

    let dataShowView = {
      checkStatus: false,
      checkResult: false,
      assignUsers: false,
    }
    if (value === CONFIRM.CANH_BAO_DUNG.code) {
      dataShowView.checkStatus = true;
      dataShowView.assignUsers = true;
      if (warningInfo.confirmStatus === value && !!warningInfo.checkStatus) {
        dataShowView.checkResult = true;
      }
    }

    setShowView(dataShowView);

    if (warningInfo.confirmStatus !== value) {
      formWarning.setFieldsValue({
        ...allFormValues,
        checkResult: '',
        checkStatus: false,
      });
      setArrSelect([]);
    } else {
      formWarning.setFieldsValue({
        ...allFormValues,
        checkResult: warningInfo?.checkResult,
        checkStatus: warningInfo?.checkStatus,
      });
      setArrSelect(warningInfo?.assignUsers)
    }
  };

  const handleChange = (value) => {
    setArrSelect(value);
  };

  return (<>
    <Loading active={props.isLoading}>
      <Row>
        <Col xs={24} md={24}>
          <Form
            id="form-position" size="default"
            form={formWarning}
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col span={14} style={{ paddingRight: '10px', paddingTop: '10px', textAlign: 'center' }}>
                <DropzoneImage
                  imgUrl={warningInfo?.imageId}
                  allowChange={false}
                  warningImage={true}
                  width={'100%'}
                  height={'100%'}
                />
              </Col>

              <Col span={10}>
                <Row>
                  <CustomSkeleton
                    size="default"
                    label={t('CONTENT_WARNING')} name="warningContent"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                    rules={[RULES.REQUIRED]}
                    form={formWarning}
                    showInputLabel={true}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('Thời gian cảnh báo')} name="createdAt"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                    rules={[RULES.REQUIRED]}
                    form={formWarning}
                    showInputLabel={true}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('OBJECT')}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                  >
                    <label>
                      {warningInfo?.object ? JSON.parse(warningInfo?.object.replaceAll('\'', '"')).map((item, index) => {
                        return <p key={index} style={{ margin: 0, padding: 0 }}>{t(item.label.toUpperCase())}</p>
                      }) : ''}
                    </label>
                  </CustomSkeleton>

                  <CustomSkeleton
                    size="default"
                    label={t('CAMERA')} name="nameCamera"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                    rules={[RULES.REQUIRED]}
                    form={formWarning}
                    showInputLabel={true}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('POSITION')} name="position"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                    rules={[RULES.REQUIRED]}
                    form={formWarning}
                    showInputLabel={true}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('POWERLINE')} name="powerline"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                    rules={[RULES.REQUIRED]}
                    form={formWarning}
                    showInputLabel={true}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('UNIT')} name="unit"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                    rules={[RULES.REQUIRED]}
                    form={formWarning}
                    showInputLabel={true}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t('CONFIRM')}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 7, md: 7, lg: 7 }}
                  >
                    <Radio.Group
                      onChange={onChangeRadio}
                      value={valueRadio}
                      disabled={
                        myInfo?.roleId && myInfo?.roleId[0] && myInfo?.roleId[0]?.code
                        && (myInfo?.roleId[0]?.code === 'MEMBER')
                      }
                    >
                      <Space direction="vertical">
                        {Object.values(CONFIRM)?.map(item => {
                          return <Radio key={item.code} value={item.code}>{item.label}</Radio>
                        })}
                      </Space>
                    </Radio.Group>
                  </CustomSkeleton>

                  {
                    showView.assignUsers &&
                    (myInfo?.roleId && myInfo?.roleId[0] && myInfo?.roleId[0]?.code
                      && (myInfo?.roleId[0]?.code !== 'MEMBER')) && <CustomSkeleton
                        size="default"
                        label={t('ASSIGNMENT')}
                        layoutCol={{ xs: 24 }}
                        labelCol={{ xs: 7, md: 7, lg: 7 }}
                      >
                      <Select
                        placeholder={t('ASSIGNMENT')}

                        value={arrSelect}
                        dropdownClassName="small"
                        onChange={handleChange}
                        mode="tags"
                      >
                        {Array.isArray(listUser) && listUser.filter(e => e.roleId[0].code !== 'ADMIN').map(item => {
                          return <Select.Option
                            key={item._id}
                            value={item._id}>
                            {item.fullName}
                          </Select.Option>;
                        })}
                      </Select>
                    </CustomSkeleton>
                  }

                  {
                    showView.checkStatus && <CustomSkeleton
                      size="default"
                      label={t('CHECK_STATUS')} name="checkStatus"
                      type={CONSTANTS.SWITCH}
                      layoutCol={{ xs: 24 }}
                      labelCol={{ xs: 7, md: 7, lg: 7 }}
                    />
                  }

                  {
                    showView.checkResult && <CustomSkeleton
                      size="default"
                      label={t('CHECK_RESULT')} name="checkResult"
                      type={CONSTANTS.TEXT_AREA}
                      layoutCol={{ xs: 24 }}
                      labelCol={{ xs: 7, md: 7, lg: 7 }}
                      form={formWarning}
                    />
                  }
                </Row>
              </Col>
            </Row>
            <Row>
              {allowChange && <Col xs={24}>
                <Space className="float-right">
                  <Link to={URL.CAMERA_ID.format(warningInfo?.cameraId?._id)}>
                    <Button
                      size="small"
                      type="primary"
                      danger
                      style={{ width: 100 }}
                    >
                      {t('WATCH_LIVE')}
                    </Button>
                  </Link>

                  <Button
                    size="small"
                    type="primary"
                    style={{ width: 100 }}
                    // icon={<SaveFilled/>}
                    onClick={handleSaveData}
                  >
                    {t('LUU')}
                  </Button>
                </Space>
              </Col>}
            </Row>
          </Form>
        </Col>
      </Row>
    </Loading>
  </>);
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(ModifyWarning));
