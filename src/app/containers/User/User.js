import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Table } from 'antd';

import AddNewButton from '@AddNewButton';
import CreateOrModifyUser from '@containers/User/CreateOrModifyUser';
import ActionCell from '@components/ActionCell';
import Filter from '@components/Filter';
import Loading from '@components/Loading'
// import DownloadButton from '@components/DownloadButton';
import { snakeCase } from 'lodash';

import { createUser, deleteUserById, getAllUserIncludedDeletedUnit, updateUserById, downloadBieuMauThongKeNguoiDung } from '@app/services/User';
import { CONSTANTS, GENDER_OPTIONS, SUBUNIT_OPTION } from '@constants';
import {
  calPageNumberAfterDelete,
  columnIndex, convertObjectToSnakeCase,
  convertQueryToObject,
  formatQueryDataExtra,
  handleReplaceUrlSearch,
  paginationConfig,
  renderFilterTreeUnit,
  toast, cloneObj
} from '@app/common/functionCommons';

import * as role from '@app/store/ducks/role.duck';

import './User.scss';
import TagAction from '@components/TagAction';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function User({ permission, isLoading, myInfo, roleList, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    userSelected: null,
  });

  const [userData, setUserData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  const [disableSubunit, setDisableSubunit] = useState(true);

  useEffect(() => {
    if (!roleList) props.getRole();

    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataUser(page, limit, queryObj);
    })();
  }, []);

  async function getDataUser(
    currentPage = userData.currentPage,
    pageSize = userData.pageSize,
    query = userData.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllUserIncludedDeletedUnit(currentPage, pageSize, query);
    if (apiResponse) {
      setUserData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
      if (query.unitId) setDisableSubunit(false);
    }
  }

  function handleShowModal(isShowModal, userSelected = null) {
    if (isShowModal) {
      setState({ isShowModal, userSelected });
    } else {
      setState({ ...state, isShowModal });
    }
  }

  async function createAndModifyUser(type, dataForm) {
    const { avatar, chuKy, ...data } = dataForm;
    const dataFormatted = convertObjectToSnakeCase(formatQueryDataExtra(data));
    const formData = new FormData();
    formData.append('json_data', JSON.stringify(dataFormatted));
    if (avatar) formData.append('avatar', avatar);

    if (type === CONSTANTS.CREATE) {
      formData.append('password', dataForm.password);
      const apiResponse = await createUser(formData);
      if (apiResponse) {
        getDataUser();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('TAO_MOI')} ${t('TAI_KHOAN')} ${t('THANH_CONG')}`);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      const apiResponse = await updateUserById(state.userSelected._id, formData);
      if (apiResponse) {
        const docs = userData.docs.map(doc => doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc);

        setUserData(Object.assign({}, userData, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('TAI_KHOAN')} ${t('THANH_CONG')}`);
      }
    }
  }

  async function handleDelete(userSelected) {
    const apiResponse = await deleteUserById(userSelected._id);
    if (apiResponse) {
      await getDataUser(calPageNumberAfterDelete(userData));
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('TAI_KHOAN')} ${t('THANH_CONG')}`);
    }
  }
  function renderMissingDataCol(isMissing, value) {
    return isMissing ? {
      props: {
        style: { background: '#d40000', color: '#FFF' },
      },
      children: <span>{value}</span>,
    } : value;
  }
  const columns = [
    columnIndex(userData.pageSize, userData.currentPage),
    { title: t('TEN'), dataIndex: 'fullName', width: 150, sorter: true, },
    { title: t('TEN_TAI_KHOAN'), dataIndex: 'username', width: 150, sorter: true, },
    {
      title: t('GIOI_TINH'),
      dataIndex: 'gender',
      render: (value) => t(GENDER_OPTIONS.find(gender => gender.value === value)?.label),
      width: 80,
    },
    {
      title: t('DON_VI'), dataIndex: 'unitId',
      render: value => renderMissingDataCol(value?.isDeleted, value?.isDeleted ? `${value?.name} - ${t('DELETED')}` : value?.name),
      width: 200
    },
    {
      title: t('VAI_TRO'), dataIndex: 'roleId', width: 150,
      render: value => {
        if (Array.isArray(value)) {
          return value.map(item => {
            return <div key={item._id}>{item?.name}</div>;
          });
        }
      },
    },
    { title: t('SO_DIEN_THOAI'), dataIndex: 'phone', width: 120 },
    {
      title: t('HOAT_DONG'), dataIndex: 'active', align: 'center', width: 100,
      render: value => {
        if (value) return <i className="fas fa-check-circle" style={{ fontSize: 20, color: '#87d068' }} />;
        if (!value) return <i className="fas fa-times-circle" style={{ fontSize: 20, color: '#F31D40' }} />;
      },
    },
    {
      align: 'center',
      render: (value) => {
        const allowUpdate = permission.update && (value._id !== myInfo._id);
        return <ActionCell
          prefix={<TagAction
            style={{ width: 95 }}
            onClick={() => handleEdit(value)}
            icon={allowUpdate ? <EditOutlined /> : <EyeOutlined />}
            label={<label style={{ paddingLeft: allowUpdate ? 6 : 3 }}>
              {allowUpdate ? t('CHINH_SUA') : t('XEM_CHI_TIET')}
            </label>}
            color={allowUpdate ? 'cyan' : 'geekblue'}
          />}
          value={value}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          permission={{ delete: permission.delete }}
          disabledDelete={value._id === myInfo._id}
        />;
      },
      fixed: 'right',
      width: 200,
    },
  ];

  function handleEdit(userSelected) {
    setState({ isShowModal: true, userSelected });
  }

  function onSearchChange(changedValues, allValues) {
    if (allValues) {
      const { unitId, includeChildren } = allValues;
      if (unitId && disableSubunit === true) {
        setDisableSubunit(false);
      }
      else if (!unitId && disableSubunit === false) setDisableSubunit(true);
    }
  }

  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'fullName', label: t('HO_TEN'), type: CONSTANTS.TEXT },
          { name: 'username', label: t('TEN_TAI_KHOAN'), type: CONSTANTS.TEXT },
          { name: 'email', label: 'Email', type: CONSTANTS.TEXT },
          { name: 'gender', label: t('GIOI_TINH'), type: CONSTANTS.SELECT, options: { data: GENDER_OPTIONS } },
        ]}
        onSearchChange={onSearchChange}
        // clearWhenRemove={[{ change: 'unitId', clear: ['includeChildren'] }]}
        handleFilter={(query) => getDataUser(1, userData.pageSize, query)}
        labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
      />

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission} />
      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={userData.docs}
          pagination={paginationConfig(getDataUser, userData)}
          scroll={{ x: 'max-content' }}
          onChange={async (pagination, filters, sorter, extra) => {
            if (extra.action === 'sort') {
              const sortObj = cloneObj(userData.query);
              if (sorter.order) {
                sortObj.sort = `${sorter.order === 'ascend' ? '' : '-'}${snakeCase(sorter.column.dataIndex)}`;
              } else {
                delete sortObj.sort;
              }
              await getDataUser(userData.currentPage, userData.pageSize, sortObj);
            }
          }}
        />
        {/* <DownloadButton onClick={() => downloadBieuMauThongKeNguoiDung(userData.query)} /> */}
      </Loading>
      <CreateOrModifyUser
        permission={{
          ...permission,
          update: permission.update && (state.userSelected?._id !== myInfo._id),
        }}
        type={!!state.userSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyUser}
        handleCancel={() => handleShowModal(false)}
        userSelected={state.userSelected}
        roleList={roleList}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.user;
  const { isLoading } = store.app;
  const { roleList } = store.role;
  const { myInfo } = store.user;
  return { permission, isLoading, roleList, myInfo };
}

export default withTranslation()(connect(mapStateToProps, { ...role.actions })(User));
