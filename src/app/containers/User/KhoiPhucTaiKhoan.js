import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import ActionCell from '@components/ActionCell';
import Filter from '@components/Filter';
import Loading from '@components/Loading';

import { getAllUserDeleted, restoreUser } from '@app/services/KhoiPhucTaiKhoan';
import { CONSTANTS, GENDER_OPTIONS } from '@constants';
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertQueryToObject,
  handleReplaceUrlSearch,
  paginationConfig,
  renderFilterTreeUnit,
  toast,
} from '@app/common/functionCommons';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function KhoiPhucTaiKhoan({ permission, isLoading, myInfo, ...props }) {
  const [userData, setUserData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataDaXoa(page, limit, queryObj);
    })();
  }, []);

  async function getDataDaXoa(
    currentPage = userData.currentPage,
    pageSize = userData.pageSize,
    query = userData.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllUserDeleted(currentPage, pageSize, query);
    if (apiResponse) {
      setUserData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  async function handleRestoreUser(userSelected) {
    const apiResponse = await restoreUser(userSelected._id);
    if (apiResponse) {
      await getDataDaXoa(calPageNumberAfterDelete(userData));
      toast(CONSTANTS.SUCCESS, `${t('KHOI_PHUC_TAI_KHOAN')} ${t('THANH_CONG')}`);
    }
  }

  const columns = [
    columnIndex(userData.pageSize, userData.currentPage),
    { title: t('TEN'), dataIndex: 'fullName', width: 150 },
    { title: t('TEN_TAI_KHOAN'), dataIndex: 'username', width: 150 },
    {
      title: t('GIOI_TINH'),
      dataIndex: 'gender',
      render: (value) => t(GENDER_OPTIONS.find(gender => gender.value === value)?.label),
      width: 80,
    },
    // { title: t('DON_VI'), dataIndex: 'unitId', render: value => value?.name, width: 200 },
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
  ];

  if (permission.update) {
    columns.push({
      align: 'center',
      render: (value) => <ActionCell
        value={value}
        handleDelete={handleRestoreUser}
        deleteIcon={<ReloadOutlined/>}
        deleteText={t('KHOI_PHUC')}
        deleteColor="geekblue"
        deleteButtonProps={{ type: 'primary' }}
        title={t('KHOI_PHUC_DU_LIEU')}
        okText={t('XAC_NHAN')}
        permission={{ delete: true }}
      />,
      fixed: 'right',
      width: 80,
    });
  }

  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'fullName', label: t('HO_TEN'), type: CONSTANTS.TEXT },
          // { name: 'unitId', label: t('DON_VI'), render: renderFilterTreeUnit(orgUnitTree) },
          { name: 'email', label: 'Email', type: CONSTANTS.TEXT },
          { name: 'gender', label: t('GIOI_TINH'), type: CONSTANTS.SELECT, options: { data: GENDER_OPTIONS } },
        ]}
        handleFilter={(query) => getDataDaXoa(1, userData.pageSize, query)}
      />

      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={userData.docs}
          pagination={paginationConfig(getDataDaXoa, userData)}
          scroll={{ x: 'max-content' }}
        />
      </Loading>

    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.user;
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { permission, isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(KhoiPhucTaiKhoan));
