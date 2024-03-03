import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Popover, Image, Tag, Space, Button, Drawer, List, Input, Form, Select, Row, Col } from "antd";

import { URL } from "@url";

import ActionCell from "@components/ActionCell";
import Filter from "@components/Filter";
import Loading from "@components/Loading";

import AddNewButton from "@AddNewButton";

import moment from "moment/moment";
import { snakeCase } from "lodash";

import { CONSTANTS, VEHICLE_TYPE } from "@constants";
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertQueryToObject,
  handleReplaceUrlSearch,
  paginationConfig,
  cloneObj,
  toast,
  formatDateTime,
} from "@app/common/functionCommons";

import TagAction from "@components/TagAction";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

import * as unit from "@app/store/ducks/unit.duck";
import * as position from "@app/store/ducks/position.duck";

import DropzoneImage from "@components/DropzoneImage";
import { updateVehicleByLicensePlates, deleteVehicle, getAllVehicle } from "../../../services/Vehicle";
import { API } from "../../../../constants/API";
import { createBlackList, deleteBlackList, getAllBlackList, updateBlackList } from "../../../services/BlackList";
import CreateOrModify from "./CreateOrModify";

function BlackList({ positionList, permission, isLoading, ...props }) {
  const [form] = Form.useForm();

  const [rowIndex, setRowIndex] = useState();
  const [formData, setFormData] = useState();
  const [type, setType] = useState(CONSTANTS.CREATE);
  const [open, setOpen] = useState(false)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const [vehicleData, setVehicleData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });
  const [blackListData, setBlackListData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  const columns = [
    columnIndex(vehicleData.pageSize, vehicleData.currentPage),
    { title: "Biển số xe", dataIndex: "licensePlates", width: 100, sorter: true },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: 100,
      sorter: true,
      render: (value) => moment(value).locale("vi").format("DD/MM/YYYY HH:mm"),
    },
    {
      align: "center",
      title: "Ảnh phương tiện",
      dataIndex: "vehicleImage",
      width: 100,
      render: (value) => {
        return (
          <>
            <DropzoneImage width={80} height={45} imgUrl={value} api={API.VIEW_VEHICLE_IMAGE} allowChange={false} />
          </>
        );
      },
    },
    {
      align: "center",
      title: "Ảnh biển số",
      dataIndex: "licensePlatesImage",
      width: 100,
      render: (value) => {
        return (
          <>
            <DropzoneImage
              width={80}
              height={45}
              imgUrl={value}
              api={API.VIEW_LICENSE_PLATES_IMAGE}
              allowChange={false}
            />
          </>
        );
      },
    },
    {
      align: "center",
      width: 50,
      render: (value) => {
        const allowUpdate = permission.update;
        return (
          <ActionCell
            prefix={
              <TagAction
                style={{ width: 95 }}
                linkTo={{ pathname: URL.VEHICLE_ID.format(value?._id), permission: false }}
                icon={<EyeOutlined />}
                label={
                  <label style={{ paddingLeft: 3 }}>
                    {t("XEM_CHI_TIET")}
                  </label>
                }
                color="geekblue"
              />
            }
            value={value}
          // handleDelete={handleDelete}
          // permission={{ delete: permission.delete }}
          />
        );
      },
      fixed: "right",
    },
  ];

  const list = [
    {
      title: t("LICENSE_PLATES"),
      dataIndex: "licensePlates",
      key: "licensePlates",
    },
    {
      title: t("LICENSE_PLATES_COLOR"),
      dataIndex: "licensePlatesColor",
      key: "licensePlatesColor",
    },
    {
      align: "center",
      width: 50,
      render: (value) => {
        const allowUpdate = permission.update;
        return (
          <ActionCell
            prefix={
              <TagAction
                // style={{ width: 95 }}
                icon={<EditOutlined />}
                onClick={(event) => { setOpen(true), setFormData(value), setType(CONSTANTS.UPDATE), event.stopPropagation() }}
                label={
                  <label style={{ paddingLeft: 3 }}>
                    {/* {t("CHINH_SUA")} */}
                    Sửa
                  </label>
                }
                color="cyan"
              />
            }
            value={value}
            handleDelete={handleDelete}
            permission={{ delete: permission.delete }}
          />
        );
      },
      fixed: "right",
    },
  ];

  const optionContent = [
    {
      value: "Vượt đèn đỏ",
      label: "Vượt đèn đỏ",
    },
    {
      value: "Nhận dạng biển số",
      label: "Nhận dạng biển số",
    },
  ];

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataVehicle(page, limit, queryObj);
      await getDataBlackList();
    })();
  }, []);

  async function getDataVehicle(
    currentPage = vehicleData.currentPage,
    pageSize = vehicleData.pageSize,
    query = vehicleData.query
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const res = await getAllVehicle(currentPage, pageSize, {
      is_black_list: true,
      tu_ngay: startOfDay.toISOString(),
      den_ngay: endOfDay.toISOString(),
      ...query,
    });

    if (res) {
      setVehicleData({
        docs: res.docs,
        totalDocs: res.totalDocs,
        pageSize: res.limit,
        currentPage: res.page,
        query: query,
      });
    }
  }
  async function getDataBlackList(
    blackListCurrentPage = blackListData.currentPage,
    blackListPageSize = blackListData.pageSize,
    blackList_query = blackListData.query
  ) {
    handleReplaceUrlSearch(props.history, blackListCurrentPage, blackListPageSize, blackList_query);

    const res = await getAllBlackList(blackListCurrentPage, blackListPageSize, blackList_query);

    if (res) {
      setBlackListData({
        docs: res.docs,
        totalDocs: res.totalDocs,
        pageSize: res.limit,
        currentPage: res.page,
        query: blackList_query,
      });
    }
  }
  async function handleDelete(itemSelected) {
    try {
      const licensePlates = itemSelected.licensePlates;

      const [apiResponse, res] = await Promise.all([
        deleteBlackList(licensePlates),
        updateVehicleByLicensePlates(licensePlates, { isBlackList: false }),
      ]);

      if (apiResponse && res) {
        await getDataBlackList(calPageNumberAfterDelete(blackListData));
        await getDataVehicle(calPageNumberAfterDelete(vehicleData));
        // await get
        toast(CONSTANTS.SUCCESS, `${t("XOA")} ${t("WARNING")} ${t("THANH_CONG")}`);
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast(CONSTANTS.ERROR, `${t("XOA")} ${t("WARNING")} ${t("THAT_BAI")}`);
    }
  }


  async function handleOk( typeForm ,values) {
    if (type === CONSTANTS.CREATE) {
      const res = await createBlackList(values)
      if (res) {
        await getDataBlackList(calPageNumberAfterDelete(blackListData));
        setOpen(false)
        toast(CONSTANTS.SUCCESS, `${t("THEM")} ${t("BLACK_LIST")} ${t("THANH_CONG")}`);
      }
    }
    if (type === CONSTANTS.UPDATE) {
      const res = await updateBlackList(formData.licensePlates, values)
      if (res) {
        await getDataBlackList(calPageNumberAfterDelete(blackListData));
        await getDataVehicle(calPageNumberAfterDelete(vehicleData));
        setOpen(false)
        toast(CONSTANTS.SUCCESS, `${t("SUA")} ${t("BLACK_LIST")} ${t("THANH_CONG")}`);
      }
    }
  }

  const onFinish = (values) => {
    const query = {
      license_plates: values.licensePlates,
      license_plates_color: values.licensePlatesColor,
    };
    getDataBlackList(1, blackListData.pageSize, query);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleClear = () => {
    form.resetFields(),
      getDataVehicle(1, vehicleData.pageSize, {}),
      getDataBlackList(1, vehicleData.pageSize, {})
  }
  const convertedArray = Object.keys(VEHICLE_TYPE).filter(key => key !== 'ALL').map(key => ({
    ...VEHICLE_TYPE[key]
  }));
  return (
    <div>
      {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}> */}
      <Row gutter={8}>
        <Col span={16}>
          <Filter
            dataSearch={[
              // {
              //   name: "content",
              //   label: t("CONTENT"),
              //   type: CONSTANTS.SELECT,
              //   options: {
              //     data: optionContent,
              //     valueString: "value",
              //     labelString: "label",
              //   },
              // },
              {
                name: "vehicle_type",
                label: t("VEHICLE_TYPE"),
                type: CONSTANTS.SELECT,
                options: {
                  data: convertedArray,
                  valueString: "value",
                  labelString: "label",
                },
              },
              {
                name: "license_plates",
                label: t("LICENSE_PLATES"),
                type: CONSTANTS.TEXT,
              },
              {
                name: "tu_ngay",
                label: t("FROM"),
                defaultValue: moment(startOfDay),
                showTime: true,
                minuteStep: 5,
                type: CONSTANTS.DATE,
              },
              {
                name: "den_ngay",
                label: t("TO"),
                defaultValue: moment(endOfDay),
                showTime: true,
                minuteStep: 5,
                type: CONSTANTS.DATE,
              },
            ]}
            handleFilter={(query) => getDataVehicle(1, vehicleData.pageSize, query)}
            labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 10, xxl: 8 }}
          />
          <p style={{ fontSize: 14, fontWeight: 500, color: '#00199f', marginBottom: 19 }}>Nhật ký phương tiện</p>
          <Loading active={isLoading}>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={vehicleData.docs}
              pagination={paginationConfig(getDataVehicle, vehicleData)}
              scroll={{ x: "max-content" }}
              onChange={async (pagination, filters, sorter, extra) => {
                if (extra.action === "sort") {
                  const sortObj = cloneObj(vehicleData.query);
                  if (sorter.order) {
                    sortObj.sort = `${sorter.order === "ascend" ? "" : "-"}${snakeCase(sorter.column.dataIndex)}`;
                  } else {
                    delete sortObj.sort;
                  }
                  await getDataVehicle(vehicleData.currentPage, vehicleData.pageSize, sortObj);
                }
              }}
            />
          </Loading>
        </Col>
        <Col span={8}>
          <Filter
            dataSearch={[
              {
                name: "licensePlates",
                label: t("LICENSE_PLATES"),
                type: CONSTANTS.TEXT,
              },
              {
                name: "licensePlatesColor",
                label: t("LICENSE_PLATES_COLOR"),
                type: CONSTANTS.SELECT,
                options: {
                  data: [
                    { value: "Màu trắng", label: "Màu trắng" },
                    { value: "Màu đỏ", label: "Màu đỏ" },
                  ],
                  valueString: "value",
                  labelString: "label",
                },
              },
            ]}
            handleFilter={(query) => {
              getDataBlackList(1, blackListData.pageSize, query),
                getDataVehicle(1, vehicleData.pageSize, query)
            }}
            labelCol={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }}
            layoutCol={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }}
            layoutRow={true}
            formLayout='vertical'
          />
          <Row>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#00199f' }}>Danh sách biển số đen</p>
              <AddNewButton type="primary" size="small" style={{ width: '100%' }} onClick={() => { setOpen(true), setFormData(), setType(CONSTANTS.CREATE) }} />
            </Space>
          </Row>
          <Loading active={isLoading}>
            <Table
              size="small"
              bordered
              // pagination={paginationConfig(getDataBlackList, blackListData)}
              scroll={{ x: "max-content" }}
              dataSource={blackListData.docs}
              columns={list}
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => {
                    getDataVehicle(1, vehicleData.pageSize, {
                      ...vehicleData.query,
                      "license_plates": record.licensePlates
                    }),
                      setRowIndex(rowIndex)
                  },
                };
              }}
            />
          </Loading>
          {/* </Drawer> */}
        </Col>
      </Row>
      <CreateOrModify
        permission={permission}
        isModalVisible={open}
        handleOk={handleOk}
        formData={formData}
        updateAllow={true}
        handleCancel={() => setOpen(false)}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.vehicle;
  const { isLoading } = store.app;
  const { positionList } = store.position;
  return { permission, isLoading, positionList };
}

const mapDispatchToProps = {
  ...unit.actions,
  ...position.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BlackList));
