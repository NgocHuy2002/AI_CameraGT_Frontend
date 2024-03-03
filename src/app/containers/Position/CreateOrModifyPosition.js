import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "antd";
import { connect } from "react-redux";

import Loading from "@components/Loading";
import CustomModal from "@components/CustomModal";
import CustomSkeleton from "@components/CustomSkeleton";

import { CONSTANTS, RULES } from "@constants";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

import MapWithMarkerClusterer from "../../components/Map/MapWithMarkerClusterer";

function CreateOrModifyPosition({ isModalVisible, handleOk, handleCancel, itemSelected, ...props }) {
  const { permission, dsUnit } = props;
  const allowChange = (permission.create && !itemSelected?._id) || (permission.update && !!itemSelected?._id);
  const [latLog, setLatLog] = useState({
    lat: null,
    long: null
  });
  const [formPosition] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {
      formPosition.resetFields();
      if (itemSelected) {
        formPosition.setFieldsValue({
          ...itemSelected,
          unitId: itemSelected?.unitId?._id,
        });
      }
    }
  }, [isModalVisible]);

  function onFinish(data) {
    if (props.isLoading) return;
    const dataRequest = { ...data };
    handleOk(itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE, dataRequest);
  }

  const handleClickedMap = (e) => {
    const lat = e.latLng.lat();
    const long = e.latLng.lng();
    setLatLog({lat, long})
    formPosition.setFieldsValue({
      lat: lat,
      long: long,
    });
  }

  return (
    <>
      <CustomModal
        width="920px"
        title={itemSelected ? t("UPDATE_POSITION") : t("CREATE_POSITION")}
        visible={isModalVisible}
        onCancel={handleCancel}
        isLoadingSubmit={props.isLoading}
        isDisabledClose={props.isLoading}
        formId="form-position"
        showFooter={!!allowChange}
        maskClosable={!allowChange}
      >
        <Loading active={props.isLoading}>
          <Row>
            <Col xs={24} md={24}>
              <Form id="form-position" size="default" form={formPosition} onFinish={onFinish}>
                <Row>
                  <CustomSkeleton
                    size="default"
                    label={t("POSITION_NAME")}
                    name="name"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    rules={[RULES.REQUIRED]}
                    form={formPosition}
                    showInputLabel={!allowChange}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("UNIT")}
                    name="unitId"
                    type={CONSTANTS.SELECT}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    options={{
                      data: dsUnit,
                      valueString: "_id",
                      labelString: "name",
                    }}
                    rules={[RULES.REQUIRED]}
                    showInputLabel={!allowChange}
                    form={formPosition}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("Vĩ độ")}
                    name="lat"
                    type={CONSTANTS.NUMBER}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    showInputLabel={!allowChange}
                    form={formPosition}
                  />

                  <CustomSkeleton
                    size="default"
                    label={t("Kinh độ")}
                    name="long"
                    type={CONSTANTS.NUMBER}
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                    showInputLabel={!allowChange}
                    form={formPosition}
                  />
                  <CustomSkeleton
                    size="default"
                    label={t("Vị trí trên bản đồ")}
                    name="color"
                    layoutCol={{ xs: 24 }}
                    labelCol={{ xs: 6, md: 6, lg: 5 }}
                  >
                    <div style={{ height: '400px' }}>
                      <MapWithMarkerClusterer
                        lat={latLog.lat || formPosition.getFieldsValue().lat}
                        lng={latLog.long || formPosition.getFieldsValue().long}
                        editMarker={true}
                        handleClickedMap={handleClickedMap}
                      />
                    </div>
                  </CustomSkeleton>
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
  return { isLoading };
}

export default withTranslation()(connect(mapStateToProps)(CreateOrModifyPosition));
