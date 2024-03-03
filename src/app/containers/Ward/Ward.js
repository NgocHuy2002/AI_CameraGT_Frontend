import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Form, Input } from "antd";
import AddNewButton from "@AddNewButton";

import ActionCell from "@components/ActionCell";
import Filter from "@components/Filter";
import Loading from "@components/Loading";
import { snakeCase } from "lodash";

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
import { createWard, getAllWard, updateWardById, deleteWard, getWardById } from '../../services/Ward';

function Ward({ unitList, powerlineList, permission, isLoading, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    itemSelected: null,
  });

  const [wardData, setWardData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataWard(page, limit, queryObj);
    })();
  }, []);

  async function getDataWard(currentPage = wardData.currentPage, pageSize = wardData.pageSize, query = wardData.query) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllWard(currentPage, pageSize, query);
    if (apiResponse) {
      setWardData({
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

  async function createAndModifyWard(type, dataForm) {
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createWard(dataForm);
      if (apiResponse) {
        getDataWard();
        const docs = wardData.docs.map((doc) => (doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc));
        handleShowModal(false);
        props.setWard(docs);
        toast(CONSTANTS.SUCCESS, `${t("TAO_MOI")} ${t("CAMERA")} ${t("THANH_CONG")}`);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      const apiResponse = await updateWardById(state.itemSelected._id, dataForm);
      if (apiResponse) {
        const docs = wardData.docs.map((doc) => (doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc));
        setWardData(Object.assign({}, wardData, { docs }));
        handleShowModal(false);
        props.setWard(docs);
        toast(CONSTANTS.SUCCESS, `${t("CHINH_SUA")} ${t("CAMERA")} ${t("THANH_CONG")}`);
      }
    }
  }

  async function handleDelete(itemSelected) {
    const apiResponse = await deleteWard(itemSelected._id);
    if (apiResponse) {
      await getDataWard(calPageNumberAfterDelete(wardData));
      toast(CONSTANTS.SUCCESS, `${t("XOA")} ${t("CAMERA")} ${t("THANH_CONG")}`);
    }
  }

  const columns = [
    columnIndex(wardData.pageSize, wardData.currentPage),
    { title: t("NAME"), dataIndex: "name", width: 150, sorter: true },
    { title: t("CODE"), dataIndex: "code", width: 150, sorter: true },
    {
      title: t("DISTRICT"),
      dataIndex: "district_id",
      width: 150,
      sorter: true,
      render: (value) => {
        return value?.name;
      },
    },
    {
      title: t("PROVINCE"),
      dataIndex: "province_id",
      width: 150,
      sorter: true,
      render: (value) => {
        return value?.name;
      },
    },
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

  return (
    <div>
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
          dataSource={wardData.docs}
          pagination={paginationConfig(getDataWard, wardData)}
          scroll={{ x: "max-content" }}
          onChange={async (pagination, filters, sorter, extra) => {
            if (extra.action === "sort") {
              const sortObj = cloneObj(wardData.query);
              if (sorter.order) {
                sortObj.sort = `${sorter.order === "ascend" ? "" : "-"}${snakeCase(sorter.column.dataIndex)}`;
              } else {
                delete sortObj.sort;
              }
              await getDataWard(wardData.currentPage, wardData.pageSize, sortObj);
            }
          }}
        />
      </Loading>
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.ward;
  const { isLoading } = store.app;
  return { permission, isLoading };
}

export default withTranslation()(connect(mapStateToProps)(Ward));
