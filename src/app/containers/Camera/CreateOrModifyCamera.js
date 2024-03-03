import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "antd";
import { connect } from "react-redux";

import Loading from "@components/Loading";
import CustomModal from "@components/CustomModal";
import CustomSkeleton from "@components/CustomSkeleton";

import { CONSTANTS, RULES } from "@constants";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

import * as unit from "@app/store/ducks/unit.duck";
import * as position from "@app/store/ducks/position.duck";

function CreateOrModifyCamera({ isModalVisible, handleOk, handleCancel, itemSelected, myInfo, permissions, ...props }) {
  const { permission, dsCameraType, positionList, unitList } = props;

  const allowChange = (permission.create && !itemSelected?._id) || (permission.update && !!itemSelected?._id);

  const [formCamera] = Form.useForm();
  const [position, setPosition] = useState([]);

  useEffect(() => {
    if (!unitList) {
      props.getAllUnit();
    }
    if (!positionList) {
      props.getAllPosition();
    }
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      formCamera.resetFields();
      if (itemSelected) {
        formCamera.setFieldsValue({
          ...itemSelected,
          unitId: itemSelected?.unitId?._id,
          typeId: itemSelected?.typeId?._id,
          positionId: itemSelected?.positionId?._id,
        });

        getAllList(itemSelected);
      } else {
        formCamera.setFieldsValue({ status: true });
        setPosition([]);
      }
    }
  }, [isModalVisible]);

  function getAllList(itemSelected) {
    if (itemSelected) {
      if (itemSelected?.unitId && itemSelected?.unitId?._id) {
        const dataPosition = positionList.filter((e) => e.unitId._id === itemSelected?.unitId?._id);
        setPosition(dataPosition);
      }
    }
  }

  function onFinish(data) {
    if (props.isLoading) return;
    let cameraType = dsCameraType.find(o => o._id === data?.typeId);
    let formatRtsp = cameraType?.formatRtsp;
    const rtspUrl = formatRtsp.replace("{USERCAM}", data?.username)
      .replace("{USERCAM}", data?.username)
      .replace("{PASSWORDCAM}", data?.password)
      .replace("{DOMAINCAM}", data?.domain?.endsWith("/") ? data?.domain?.slice(0, -1) : data?.domain)
      .replace("{CHANNELCAM}", data?.channel || 1)
      .replace("{SUBTYPECAM}", data?.subtype || 0);
    const dataRequest = { ...data, rtspUrl: rtspUrl };
    handleOk(itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, dataRequest);
  }

  return (
    <>
      <CustomModal
        width="920px"
        title={itemSelected ? t("UPDATE_CAMERA") : t("CREATE_CAMERA")}
        visible={isModalVisible}
        onCancel={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
        formId="form-camera"
        showFooter={!!allowChange}
        maskClosable={!allowChange}
      >
        <Loading active={props.isLoading}>
          <Row>
            <Col xs={24} md={24}>
              <Form id="form-camera" size="default" form={formCamera} onFinish={onFinish}>
                <Row>
                  <CustomSkeleton
                    size="default"
                    label={t("CAMERA")}
                    name="name"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formCamera}
                    showInputLabel={!allowChange}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("CAMERA_TYPE")}
                    name="typeId"
                    type={CONSTANTS.SELECT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    options={{
                      data: dsCameraType,
                      valueString: "_id",
                      labelString: "brand",
                    }}
                    rules={[RULES.REQUIRED]}
                    showInputLabel={!allowChange}
                    form={formCamera}
                  />
                  
                  <CustomSkeleton
                    size="default"
                    label={t("DOMAIN")}
                    name="domain"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formCamera}
                    showInputLabel={!allowChange}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("CAMERA_ACCOUNT")}
                    name="username"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formCamera}
                    showInputLabel={!allowChange}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("CAMERA_PASS")}
                    name="password"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formCamera}
                    showInputLabel={!allowChange}
                  />

                  {/* <CustomSkeleton
                    size="default"
                    label={t("PORT")}
                    name="port"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formCamera}
                    showInputLabel={!allowChange}
                  /> */}

                  {myInfo.isSystemAdmin && (
                    <>
                      {/* <CustomSkeleton
                        size="default"
                        label={t("Chiều dài")}
                        name="camWidth"
                        type={CONSTANTS.NUMBER}
                        layoutCol={{ xs: 24 }}
                        labelCol={{ xs: 6, md: 6, lg: 5 }}
                        rules={[RULES.REQUIRED]}
                        form={formCamera}
                        showInputLabel={!allowChange}
                      />

                      <CustomSkeleton
                        size="default"
                        label={t("Chiều rộng")}
                        name="camHeight"
                        type={CONSTANTS.NUMBER}
                        layoutCol={{ xs: 24 }}
                        labelCol={{ xs: 6, md: 6, lg: 5 }}
                        rules={[RULES.REQUIRED]}
                        form={formCamera}
                        showInputLabel={!allowChange}
                      /> */}

                      <CustomSkeleton
                        size="default"
                        label={t("Thời gian nhận dạng")}
                        name="identificationTime"
                        type={CONSTANTS.NUMBER}
                        layoutCol={{ xs: 20 }}
                        labelCol={{ xs: 7, md: 7, lg: 6 }}
                        rules={[RULES.REQUIRED]}
                        form={formCamera}
                        showInputLabel={!allowChange}
                      />

                      <div style={{ margin: "5px auto" }}>
                        <span>Giây</span>
                      </div>
                    </>
                  )}

                  <CustomSkeleton
                    size="default"
                    label={t("UNIT_NAME")}
                    name="unitId"
                    type={CONSTANTS.SELECT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    options={{
                      data: unitList,
                      valueString: "_id",
                      labelString: "name",
                    }}
                    rules={[RULES.REQUIRED]}
                    showInputLabel={!allowChange}
                    form={formCamera}
                    onChange={(item) => {
                      const data = positionList.filter((e) => e.unitId._id === item);
                      setPosition(data);
                      formCamera.setFieldsValue({
                        positionId: null,
                      });
                    }}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("POSITION_NAME")}
                    name="positionId"
                    type={CONSTANTS.SELECT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    options={{
                      data: position,
                      valueString: "_id",
                      labelString: "name",
                    }}
                    rules={[RULES.REQUIRED]}
                    showInputLabel={!allowChange}
                    form={formCamera}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("STATUS")}
                    name="status"
                    type={CONSTANTS.SWITCH}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formCamera}
                    showInputLabel={!allowChange}
                  />
                </Row>
              </Form>
            </Col>
          </Row>
        </Loading>
      </CustomModal>
    </>
  );
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { unitList } = store.unit;
  const { positionList } = store.position;
  const { permissions } = store.user;
  return { isLoading, unitList, positionList, permissions };
}

const mapDispatchToProps = {
  ...unit.actions,
  ...position.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CreateOrModifyCamera));
