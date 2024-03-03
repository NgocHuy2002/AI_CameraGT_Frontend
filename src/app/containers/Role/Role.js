import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

import ActionCell from '@components/ActionCell';
import Filter from '@components/Filter';
import Loading from '@components/Loading';
import AddNewButton from '@AddNewButton';
import CreateOrModifyRole from '@containers/Role/CreateOrModifyRole';

import { CONSTANTS } from '@constants';
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertObjToSnakeCase,
  convertQueryToObject, handleReplaceUrlSearch,
  paginationConfig,
  toast,
} from '@app/common/functionCommons';
import { createRole, deleteRole, getAllRole, updateRole } from '@app/services/Role';
import updateDataStore from '@app/common/updateDataStore';

import * as role from '@app/store/ducks/role.duck';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function Role({ permission, isLoading, roleList, myInfo, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    roleSelected: null,
  });

  const [roleData, setRoleData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataRole(page, limit, queryObj);
    })();
  }, []);

  async function getDataRole(
    currentPage = roleData.currentPage,
    pageSize = roleData.pageSize,
    query = roleData.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllRole(currentPage, pageSize, query);
    if (apiResponse) {
      setRoleData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  function handleShowModal(isShowModal, roleSelected = null) {
    if (isShowModal) {
      setState({ isShowModal, roleSelected });
    } else {
      setState({ ...state, isShowModal });
    }
  }

  async function createAndModifyRole(type, dataForm) {
    const dataRequest = convertObjToSnakeCase(dataForm);

    if (type === CONSTANTS.CREATE) {
      dataRequest.password = dataForm.password;

      const apiResponse = await createRole(dataRequest);
      if (apiResponse) {
        getDataRole();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('TAO_MOI')} ${t('VAI_TRO')} ${t('THANH_CONG')}`);
        updateStoreRole(type, apiResponse);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.roleSelected._id;
      const apiResponse = await updateRole(dataRequest);
      if (apiResponse) {
        const docs = roleData.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setRoleData(Object.assign({}, roleData, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('VAI_TRO')} ${t('THANH_CONG')}`);
        updateStoreRole(type, apiResponse);
      }
    }
  }

  async function handleDelete(roleSelected) {
    const apiResponse = await deleteRole(roleSelected._id);
    if (apiResponse) {
      await getDataRole(calPageNumberAfterDelete(roleData));
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('VAI_TRO')} ${t('THANH_CONG')}`);
      updateStoreRole(CONSTANTS.DELETE, apiResponse);
    }
  }

  function updateStoreRole(type, dataResponse) {
    if (!type || !dataResponse || !roleList?.length) return;
    const roleListUpdated = updateDataStore(type, roleList, dataResponse);
    props.setRole(roleListUpdated);
  }

  const dataSource = roleData.docs;
  const columns = [
    columnIndex(roleData.pageSize, roleData.currentPage),
    { title: t('TEN_VAI_TRO'), dataIndex: 'name', width: 200 },
    { title: t('MA_VAI_TRO'), dataIndex: 'code', width: 150 },
    {
      align: 'center',
      render: (value) => <ActionCell
        value={value}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        permission={permission}
        disabledDelete={!myInfo.isSystemAdmin}
      />,
      fixed: 'right',
      width: 200,
    },
  ];

  function handleEdit(roleSelected) {
    setState({ isShowModal: true, roleSelected });
  }

  function handleChangePagination(current, pageSize) {
    getDataRole(current, pageSize);
  }

  const pagination = paginationConfig(handleChangePagination, roleData);

  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'name', label: t('TEN_VAI_TRO'), type: CONSTANTS.TEXT },
          { name: 'code', label: t('MA_VAI_TRO'), type: CONSTANTS.TEXT },
        ]}
        layoutCol={{ xs: 24, sm: 24, md: 12, lg: 10, xl: 9, xxl: 9 }}
        labelCol={{}}
        handleFilter={(query) => getDataRole(1, roleData.pageSize, query)}
      />

      {myInfo?.isSystemAdmin && <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission}/>}
      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: 'max-content' }}
        />
      </Loading>
      <CreateOrModifyRole
        permission={permission}
        type={!!state.roleSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyRole}
        handleCancel={() => handleShowModal(false)}
        roleSelected={state.roleSelected}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.vaiTro;
  const { isLoading } = store.app;
  const { roleList } = store.role;
  const { myInfo } = store.user;
  return { permission, isLoading, roleList, myInfo };
}

export default withTranslation()(connect(mapStateToProps, { ...role.actions })(Role));
