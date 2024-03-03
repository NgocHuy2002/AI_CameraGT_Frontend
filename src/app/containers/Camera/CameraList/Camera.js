import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";

import { VideoCameraOutlined } from "@ant-design/icons";
import { Link, useHistory, withRouter } from "react-router-dom";

import { URL } from "@url";
import AddNewButton from "@AddNewButton";
import CustomModal from "@components/CustomModal";
import CreateOrModifyCamera from "../CreateOrModifyCamera";
import ActionCell from "@components/ActionCell";
import Filter from "@components/Filter";
import Loading from "@components/Loading";
import { snakeCase } from "lodash";

import { createCamera, getAllCamera, updateCameraById, deleteCamera, getCameraById } from "../../../services/Camera";
import { getAllCameraType } from "../../../services/CameraType";

import { CONSTANTS } from "@constants";
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertQueryToObject,
  handleReplaceUrlSearch,
  paginationConfig,
  cloneObj,
  toast,
} from "@app/common/functionCommons";

import TagAction from "@components/TagAction";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

import * as unit from "@app/store/ducks/unit.duck";
import * as position from "@app/store/ducks/position.duck";
import * as camera from "@app/store/ducks/camera.duck";

function Camera({ positionList, unitList, permission, isLoading, myInfo, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    itemSelected: null,
  });

  const [cameraData, setCameraData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  const [dsCameraType, setDsCameraType] = useState([]);
  const [dsPosition, setDsPosition] = useState([]);

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataCamera(page, limit, queryObj);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const allCameraType = await getAllCameraType();
      if (allCameraType && allCameraType.length > 0) {
        setDsCameraType(allCameraType);
      }
    })();
  }, []);

  useEffect(() => {
    if (!unitList) {
      props.getAllUnit();
    }
    if (!positionList) {
      props.getAllPosition();
    }
  }, []);

  async function getDataCamera(
    currentPage = cameraData.currentPage,
    pageSize = cameraData.pageSize,
    query = cameraData.query
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllCamera(currentPage, pageSize, query);
    if (apiResponse) {
      setCameraData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  function handleShowModal(isShowModal, itemSelected = null) {
    if (isShowModal) {
      setState({ isShowModal, itemSelected });
    } else {
      setState({ ...state, isShowModal });
    }
  }

  async function createAndModifyCamera(type, dataForm) {
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createCamera(dataForm);
      if (apiResponse) {
        getDataCamera();
        // cameraData.docs.push(apiResponse);
        const docs = cameraData.docs.map((doc) => (doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc));
        handleShowModal(false);
        props.setCamera(docs);
        toast(CONSTANTS.SUCCESS, `${t("TAO_MOI")} ${t("CAMERA")} ${t("THANH_CONG")}`);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      const apiResponse = await updateCameraById(state.itemSelected._id, dataForm);
      if (apiResponse) {
        const docs = cameraData.docs.map((doc) => (doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc));
        setCameraData(Object.assign({}, cameraData, { docs }));
        handleShowModal(false);
        props.setCamera(docs);
        toast(CONSTANTS.SUCCESS, `${t("CHINH_SUA")} ${t("CAMERA")} ${t("THANH_CONG")}`);
      }
    }
  }

  async function handleDelete(itemSelected) {
    const apiResponse = await deleteCamera(itemSelected._id);
    if (apiResponse) {
      const docs = cameraData.docs.map((doc) => (doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc));
      await getDataCamera(calPageNumberAfterDelete(cameraData));
      // props.setPowerline(docs);
      toast(CONSTANTS.SUCCESS, `${t("XOA")} ${t("CAMERA")} ${t("THANH_CONG")}`);
    }
  }

  function handleDanDuong(position) {
    window.open(`http://maps.google.com/maps?q=${position?.lat},${position?.long}`);
  }

  function renderDataCamInfo(value) {
    return (
      <>
        <div>
          <b>{t("DOMAIN")}</b>: {value?.domain}
        </div>
        <div>
          <b>{t("CAMERA_ACCOUNT")}</b>: {value?.username}
        </div>
        <div>
          <b>{t("CAMERA_PASS")}</b>: {value?.password}
        </div>
        {myInfo.isSystemAdmin && (
          <>
            {/* <div>
              <b>{t("PORT")}</b>: {value?.port}
            </div> */}
            {/* <div>
              <b>{t("Chiều dài")}</b>: {value?.camWidth}
            </div>
            <div>
              <b>{t("Chiều rộng")}</b>: {value?.camHeight}
            </div> */}
            <div>
              <b>{t("Thời gian nhận dạng")}</b>: {value?.identificationTime}
            </div>
          </>
        )}
      </>
    );
  }

  function renderDataAddressInfo(value) {
    return (
      <>
        <div><b>{t('UNIT_NAME')}</b>: {value?.unitId?.name}</div>
        <div><b>{t('POSITION_NAME')}</b>: {value?.positionId?.name}</div>

        {
          (value?.positionId?.lat && value?.positionId.long) &&
          <Button type="primary" size='small' onClick={() => handleDanDuong(value?.positionId)}>Dẫn đường</Button>
        }
      </>
    );
  }

  const columns = [
    columnIndex(cameraData.pageSize, cameraData.currentPage),
    // {
    //   title: t("WATCH_LIVE"),
    //   width: 100,
    //   align: "center",
    //   render: (value) => {
    //     return (
    //       <>
    //         <Link to={URL.CAMERA_ID.format(value?._id)}>
    //           <VideoCameraOutlined style={{ fontSize: "28px", color: "#5cdbd3" }} />
    //         </Link>
    //       </>
    //     );
    //   },
    // },
    { title: t("CAMERA"), dataIndex: "name", width: 150, sorter: true },
    {
      title: t("CAMERA_TYPE"),
      dataIndex: "typeId",
      width: 150,
      sorter: true,
      render: (value) => {
        return value?.brand;
      },
    },
    {
      title: t("CAMERA_INFO"),
      width: 300,
      render: (value) => renderDataCamInfo(value),
      hidden: true,
    },
    {
      title: t("ADDRESS_INFO"),
      width: 300,
      render: (value) => renderDataAddressInfo(value),
    },
    // { title: t('TIME_SEND_FRAME'), dataIndex: 'timeSendFrame', width: 200, align: 'center' },
    {
      title: t("STATUS"),
      dataIndex: "status",
      width: 100,
      align: "center",
      render: (value) => {
        if (value) return <i className="fas fa-check-circle" style={{ fontSize: 20, color: "#87d068" }} />;
        if (!value) return <i className="fas fa-times-circle" style={{ fontSize: 20, color: "#F31D40" }} />;
      },
    },
    // { title: t('Chiều dài'), dataIndex: 'camWidth', width: 200, align: 'center', hidden: true },
    // { title: t('Chiều rộng'), dataIndex: 'camHeight', width: 200, align: 'center', hidden: true },
    // { title: t('Thời gian nhận dạng'), dataIndex: 'identificationTime', width: 200, align: 'center', hidden: true },
    {
      align: "center",
      render: (value) => {
        const allowUpdate = permission.update;
        return (
          <ActionCell
            prefix={
              <TagAction
                style={{ width: 95 }}
                onClick={() => handleEdit(value)}
                icon={allowUpdate ? <EditOutlined /> : <EyeOutlined />}
                label={
                  <label style={{ paddingLeft: allowUpdate ? 6 : 3 }}>
                    {allowUpdate ? t("CHINH_SUA") : t("XEM_CHI_TIET")}
                  </label>
                }
                color={allowUpdate ? "cyan" : "geekblue"}
              />
            }
            value={value}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            permission={{ delete: permission.delete }}
          />
        );
      },
      fixed: "right",
      width: 200,
    },
  ];

  function handleEdit(itemSelected) {
    setState({ isShowModal: true, itemSelected });
  }

  return (
    <div>
      <Filter
        dataSearch={[
          { name: "name", label: t("CAMERA"), type: CONSTANTS.TEXT },
          {
            name: "typeId",
            label: t("CAMERA_TYPE"),
            type: CONSTANTS.SELECT,
            options: {
              data: dsCameraType,
              valueString: "_id",
              labelString: "name",
            },
          },
        ]}
        handleFilter={(query) => getDataCamera(1, cameraData.pageSize, query)}
        labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
      />

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission} />
      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={
            myInfo.isSystemAdmin ||
            (myInfo?.roleId && myInfo?.roleId[0] && myInfo?.roleId[0]?.code && myInfo?.roleId[0]?.code === "ADMIN")
              ? columns
              : columns.filter((col) => !col.hidden)
          }
          dataSource={cameraData.docs}
          pagination={paginationConfig(getDataCamera, cameraData)}
          scroll={{ x: "max-content" }}
          onChange={async (pagination, filters, sorter, extra) => {
            if (extra.action === "sort") {
              const sortObj = cloneObj(cameraData.query);
              if (sorter.order) {
                sortObj.sort = `${sorter.order === "ascend" ? "" : "-"}${snakeCase(sorter.column.dataIndex)}`;
              } else {
                delete sortObj.sort;
              }
              await getDataCamera(cameraData.currentPage, cameraData.pageSize, sortObj);
            }
          }}
        />
      </Loading>
      <CreateOrModifyCamera
        permission={permission}
        myInfo={myInfo}
        type={!!state.itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyCamera}
        handleCancel={() => handleShowModal(false)}
        itemSelected={state.itemSelected}
        dsCameraType={dsCameraType}
        dsUnit={unitList}
        dsPosition={dsPosition}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.camera;
  const { isLoading } = store.app;
  const { unitList } = store.unit;
  const { positionList } = store.position;
  const { myInfo } = store.user;
  return { permission, isLoading, unitList, positionList, myInfo };
}

const mapDispatchToProps = {
  ...unit.actions,
  ...position.actions,
  ...camera.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Camera));
