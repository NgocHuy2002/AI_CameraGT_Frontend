import React, { useEffect, useState, useRef } from "react";
import { Col, Form, Row, Image, Radio, Space, Button, Select, Input, Popconfirm, Tag } from "antd";
import { connect } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";

import Loading from "@components/Loading";
import CustomSkeleton from "@components/CustomSkeleton";
import TagAction from '@components/TagAction';

import { URL } from "@url";
import { CONSTANTS, RULES, CONFIRM, OBJECT, VEHICLE_TYPE } from "@constants";
import { t } from "i18next";
import { withTranslation } from "react-i18next";
import DropzoneImage from "@components/DropzoneImage";
import { getAllUserIncludedDeletedUnit } from "../../../services/User";
import { toast, formatDateTime } from "@app/common/functionCommons";
import { getVehicleById, updateVehicleByLicensePlates, updateVehicleById } from "../../../services/Vehicle";
import { API } from "../../../../constants/API";
import moment from "moment/moment";
import {
  createNewOnwer,
  getOwnerByLicensePlates,
  updateOwnerById,
  updateOwnerByLicensePlates,
} from "../../../services/Owner";
import { createBlackList, updateBlackList } from "../../../services/BlackList";

function ModifyVehicle({ permission, ...props }) {
  const { myInfo } = props;
  const allowUpdate = permission.update;
  let { id } = useParams();

  const [vehicleInfo, setVehicleInfo] = useState({});
  const [disabledPopup, setDisablePopup] = useState(true)
  const [showView, setShowView] = useState({
    checkStatus: false,
    checkResult: false,
    assignUsers: false,
  });

  const [valueRadio, setValueRadio] = useState("");

  const [listUser, setListUser] = useState([]);

  const [arrSelect, setArrSelect] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    getDataVehicleID();
  }, [id]);


  async function getDataVehicleID() {
    const apiResponse = await getVehicleById(id);

    if (apiResponse) {
      const licensePlates = apiResponse.licensePlates;

      const [owner, resetFieldsData] = await Promise.all([getOwnerByLicensePlates(licensePlates), form.resetFields()]);

      // Set vehicle info
      setVehicleInfo(apiResponse);
      form.setFieldsValue({
        ...apiResponse,
        detectLocatin: apiResponse?.cameraId?.positionId?.name,
        // location: apiResponse?.cameraId?.unitId?.address,
        content1: apiResponse.content,
        time: moment(apiResponse?.createAt).format("DD/MM/YYYY HH:mm"),
        vehicleType: t(apiResponse?.vehicleType),
        name: owner[0]?.name || "",
        address: owner[0]?.address || "",
        cccd: owner[0]?.cccd || "",
        ...resetFieldsData,
      });
    }
  }
  const handleCheckLicensePlates = async () => {
    const values = form.getFieldsValue();
    const licensePlates = values.licensePlates;
    if (licensePlates != vehicleInfo.licensePlates && vehicleInfo.isBlackList === true) {
      setDisablePopup(false)
    }
    // else {
    //   await handleSaveData()
    // }
  }
  const allowAddToBlackList =async () => {
    await handleSaveData(true)
    await handleAddToBlackList()
  }
  const notAllowAddToBlackList = async () => {
    await handleSaveData(false)
    
  }
  async function handleSaveData( addBL) {
    addBL = addBL || false
    console.log(addBL);
    const values = form.getFieldsValue();
    const licensePlates = values.licensePlates;

    const owner = await getOwnerByLicensePlates(licensePlates);
    const newVehicleInfo = {
      license_plates: values.licensePlates,
      vehicle_type: values.vehicleType,
      vehicle_color: values.vehicleColor,
      vehicle_brand: values.vehicleBrand,
      vehicle_style: values.vehicleStyle,
      license_plates_color: values.licensePlatesColor,
      is_black_list: addBL,
    }
    const update = {
      name: values.name,
      cccd: values.cccd,
      address: values.address,
      license_plates: licensePlates,
    };
    // update or create Owner
    const apiResponse = owner.length == 0 ? await createNewOnwer(update) : await updateOwnerByLicensePlates(vehicleInfo.licensePlates, update);
    // update vehicle info
    await updateVehicleById(vehicleInfo._id, newVehicleInfo);
    // await updateBlackList(values.licensePlates, newVehicleInfo);
    // if (!disabledPopup) {
    //   handleAddToBlackList()
    // }
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, `${t("CHINH_SUA")} ${t("VEHICLE")} ${t("THANH_CONG")}`);
    }
  }

  async function handleAddToBlackList() {
    const values = form.getFieldsValue();
    const value = {
      licensePlates: values.licensePlates,
      vehicleType: values.vehicleType,
      vehicleColor: values.vehicleColor,
      licensePlatesColor: values.licensePlatesColor,
      isBlackList: true,
    };
    const vehicle = {
      licensePlates: values.licensePlates,
      vehicleType: values.vehicleType,
      vehicleColor: values.vehicleColor,
      licensePlatesColor: values.licensePlatesColor,
    }
    // console.log('vehicle >>>', vehicle);
    // if (!disabledPopup) {

    // }
    const res = await updateVehicleByLicensePlates(vehicleInfo.licensePlates, value);
    const res1 = await createBlackList(vehicle);
    if (res && res1) {
      toast(CONSTANTS.SUCCESS, 'Đã thêm phương tiện vào danh sách đen');
    }
  }
  const convertedArray = Object.keys(VEHICLE_TYPE).filter(key => key !== 'ALL').map(key => ({
    ...VEHICLE_TYPE[key]
  }));
  return (
    <>
      <Loading active={props.isLoading}>
        <Row>
          <Col xs={24} md={24} lg={24}>
            <Form id="form-position" size="default" form={form}>
              <Row>
                <Col span={12} style={{ paddingRight: "10px", paddingTop: "10px", textAlign: "center" }}>
                  <DropzoneImage
                    width={"100%"}
                    height={"100%"}
                    imgUrl={vehicleInfo?.image}
                    api={API.VIEW_IMAGE}
                    allowChange={false}
                  />
                </Col>

                <Col span={12}>
                  <Row gutter={8}>
                    <CustomSkeleton
                      size="default"
                      label={t("DETECT_LOCATION")}
                      name="detectLocatin"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 24 }}
                      labelCol={{ xs: 7, md: 7, lg: 6 }}
                      rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={true}
                    />
                    {/* <CustomSkeleton
                      size="default"
                      name="location"
                      label={""}
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 24 }}
                      labelCol={{ xs: 7, md: 7, lg: 6 }}
                      // rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={true}
                    /> */}
                    <CustomSkeleton
                      size="default"
                      label={t("CONTENT")}
                      name="content1"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, lg: 12 }}
                      rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={true}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("DETECT_TIME")}
                      name="time"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, lg: 12 }}
                      rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={true}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("LICENSE_PLATES")}
                      name="licensePlates"
                      // onChange={handleCheckLicensePlates}
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("VEHICLE_TYPE")}
                      name="vehicleType"
                      type={CONSTANTS.SELECT}
                      options={{
                        data: convertedArray,
                        valueString: "value",
                        labelString: "label",
                      }}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label="Hãng xe"
                      name="vehicleBrand"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      // rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label="Kiểu dáng xe"
                      name="vehicleStyle"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      // rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("VEHICLE_COLOR")}
                      name="vehicleColor"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      // rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />

                    <CustomSkeleton
                      size="default"
                      label={t("LICENSE_PLATES_COLOR")}
                      name="licensePlatesColor"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      // rules={[RULES.REQUIRED]}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label="Chủ phương tiện"
                      name="name"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("CCCD")}
                      name="cccd"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 12 }}
                      labelCol={{ xs: 8, md: 7, lg: 12 }}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("OWNER_ADDRESS")}
                      name="address"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 24 }}
                      labelCol={{ xs: 8, md: 7, lg: 6 }}
                      form={form}
                      showInputLabel={!allowUpdate}
                    />
                    <CustomSkeleton
                      size="default"
                      label={t("STATUS")}
                      name="status"
                      type={CONSTANTS.TEXT}
                      layoutCol={{ xs: 24 }}
                      labelCol={{ xs: 8, md: 7, lg: 6 }}
                      form={form}
                      showInputLabel={true}
                    />
                  </Row>
                </Col>
              </Row>
              <Row>
                {allowUpdate && (
                  <Col xs={24}>
                    <Space className="float-right">
                      <Popconfirm
                        title={t('ADD_TO_BLACK_LIST')}
                        onConfirm={handleAddToBlackList}
                        okText='Đồng ý'
                        cancelText='Hủy'
                      >
                        <Button size="small" type="primary">
                          Thêm danh sách đen
                        </Button>
                      </Popconfirm>
                      {/* <Popconfirm
                        title={t('CHECK_BLACK_LIST')}
                        onConfirm={allowAddToBlackList}
                        onCancel={notAllowAddToBlackList}
                        okText='Đồng ý'
                        cancelText='Hủy'
                        disabled={disabledPopup}
                      > */}
                        <Button size="small" type="primary" style={{ width: 100 }} onClick={() => handleSaveData(vehicleInfo.isBlackList)}>
                          {t("LUU")}
                        </Button>
                      {/* </Popconfirm> */}
                    </Space>
                  </Col>
                )}
              </Row>
            </Form>
          </Col>
        </Row>
      </Loading>
    </>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.vehicle;
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { permission, isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(ModifyVehicle));
