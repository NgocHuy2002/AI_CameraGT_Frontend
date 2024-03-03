import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Popover, Image, Tag, notification } from "antd";

import { URL } from "@url";

import ActionCell from "@components/ActionCell";
import Filter from "@components/Filter";
import Loading from "@components/Loading";
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
import { deleteVehicle, getAllVehicle } from "../../../services/Vehicle";
import { API } from "../../../../constants/API";

function VehicleList({ positionList, unitList, permission, isLoading, myInfo, ...props }) {
  const [position, setPosition] = useState([]);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  let tu_ngay = startOfDay?.toISOString()
  let den_ngay = endOfDay?.toISOString()
  useEffect(() => {
    if (!unitList) {
      props.getAllUnit();
    }
    if (!positionList) {
      props.getAllPosition();
    }
  }, []);
  const [vehicleData, setVehicleData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataVehicle(page, limit, queryObj);
    })();
  }, []);

  async function getDataVehicle(
    currentPage = vehicleData.currentPage,
    pageSize = vehicleData.pageSize,
    query = vehicleData.query
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllVehicle(currentPage, pageSize, {
      tu_ngay: tu_ngay,
      den_ngay: den_ngay,
      ...query
    });
    if (apiResponse) {
      setVehicleData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  // async function handleDelete(itemSelected) {
  //   const apiResponse = await deleteVehicle(itemSelected._id);
  //   if (apiResponse) {
  //     await getDataVehicle(calPageNumberAfterDelete(vehicleData));
  //     toast(CONSTANTS.SUCCESS, `${t("XOA")} ${t("WARNING")} ${t("THANH_CONG")}`);
  //   }
  // }

  function renderDataVehicleInfo(value) {
    return (
      <>
        {value?.positionId && (
          <div>
            <b>{t("POSITION")}</b>: {value?.positionId?.name}
          </div>
        )}
        {value?.unitId && (
          <div>
            <b>{t("UNIT")}</b>: {value?.unitId?.name || value?.unitId?.name}
          </div>
        )}
      </>
    );
  }

  function renderDataObject(value) {
    value = value.replaceAll("'", '"');
    const arrObject = JSON.parse(value);
    return (
      <div>
        {arrObject.map((item, index) => {
          return (
            <p key={index} style={{ margin: 0, padding: 0 }}>
              {t(item.label.toUpperCase())}
            </p>
          );
        })}
      </div>
    );
  }
  const columns = [
    columnIndex(vehicleData.pageSize, vehicleData.currentPage),
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: "20%",
      sorter: true,
      render: (value) => moment(value).locale('vi').format("DD/MM/YYYY HH:mm")
    },
    {
      title: t("NAME_CAMERA"),
      dataIndex: "cameraId",
      width: "15%",
      sorter: true,
      render: (value) => value?.name || "",
    },
    { title: t("CONTENT"), dataIndex: "content", width: "20%", sorter: true },
    {
      title: t('VEHICLE_TYPE'),
      dataIndex: "vehicleType",
      width: "15%",
      sorter: true,
      render: (value) => {
        return (
          <>
            {t(value)}
          </>
        )
      }
    },
    { title: "Biển số xe", dataIndex: "licensePlates", width: "15%", sorter: true },
    {
      align: "center",
      title: "Ảnh phương tiện",
      dataIndex: "vehicleImage",
      width: "10%",
      render: (value) => {
        return (
          <>
            <DropzoneImage
              width={80}
              height={45}
              imgUrl={value}
              api={API.VIEW_VEHICLE_IMAGE}
              allowChange={false}
            />
          </>
        );
      },
    },
    {
      align: "center",
      title: "Ảnh biển số",
      dataIndex: "licensePlatesImage",
      width: "10%",
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
      align: 'center',
      render: (value) => {
        const allowUpdate = permission.update;
        return <ActionCell
          prefix={<TagAction
            style={{ width: 95 }}
            linkTo={{ pathname: URL.VEHICLE_ID.format(value?._id), permission: permission }}
            icon={allowUpdate ? <EditOutlined /> : <EyeOutlined />}
            label={<label style={{ paddingLeft: allowUpdate ? 6 : 3 }}>
              {allowUpdate ? t('CHINH_SUA') : t('XEM_CHI_TIET')}
            </label>}
            color={allowUpdate ? 'cyan' : 'geekblue'}
          />}
          value={value}
        // handleDelete={handleDelete}
        // permission={{ delete: permission.delete }}
        />;
      },
      fixed: 'right',
      width: 100,
    },
  ];
  const optionContent = [
    {
      value: 'Vượt đèn đỏ',
      label: 'Vượt đèn đỏ'
    },
    {
      value: 'Nhận dạng biển số',
      label: 'Nhận dạng biển số'
    }
  ]
  const convertedArray = Object.keys(VEHICLE_TYPE).filter(key => key !== 'ALL').map(key => ({
    ...VEHICLE_TYPE[key]
  }));
  const filterData = (query) => {
    const tu_ngay = query.tu_ngay;
    const den_ngay = query.den_ngay;
    const days = den_ngay[0].diff(tu_ngay[0], 'days');
    if (days > 30) {
      toast(CONSTANTS.WARNING, t('OUT_OF_RANGER'));
    }
    else{
      getDataVehicle(1, vehicleData.pageSize, query)
    }
  }
  return (
    <div>
      <Filter
        dataSearch={[
          {
            name: "content",
            label: t("CONTENT"),
            type: CONSTANTS.SELECT,
            options: {
              data: optionContent,
              valueString: "value",
              labelString: "label",
            },
          },
          {
            name: "vehicle_type",
            label: t("VEHICLE_LIST"),
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
        handleFilter={(query) => filterData(query)}
        labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
      />

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
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.vehicle;
  const { isLoading } = store.app;
  const { unitList } = store.unit;
  const { positionList } = store.position;
  const { myInfo } = store.user;
  return { permission, isLoading, unitList, positionList, myInfo };
}

const mapDispatchToProps = {
  ...unit.actions,
  ...position.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(VehicleList));
