import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Tabs } from 'antd';

import AddNewButton from '@AddNewButton';

import CreateOrModifyUnit from './CreateOrModifyUnit';

import ActionCell from '@components/ActionCell';
import Filter from '@components/Filter';
import Loading from '@components/Loading'
import { snakeCase } from 'lodash';

import { createUnit, getAllUnit, updateUnitById, deleteUnit } from '../../services/Unit';
import UnitTree from './UnitTree';

import { CONSTANTS, ORG_UNIT_TYPE } from '@constants';
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertQueryToObject,
  handleReplaceUrlSearch,
  paginationConfig,
  cloneObj, toast
} from '@app/common/functionCommons';

import TagAction from '@components/TagAction';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

import updateDataStore from '@app/common/updateDataStore';

import * as unit from '@app/store/ducks/unit.duck';

function Unit({ permission, isLoading, unitList, myInfo, myOrgUnit, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    itemSelected: null,
  });

  useEffect(() => {
    if (!unitList) {
      props.getAllUnit();
    }
  }, []);


  const [unit, setUnitData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataUnit(page, limit, queryObj);
    })();
  }, []);

  function updateStoreUnit(type, dataResponse) {
    if (!type || !dataResponse || !unitList.length) return;
    const unitListUpdated = updateDataStore(type, unitList, dataResponse);
    props.setUnit(unitListUpdated);
    // props.getOrgUnitTree();
  }

  async function getDataUnit(
    currentPage = unit.currentPage,
    pageSize = unit.pageSize,
    query = unit.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllUnit(currentPage, pageSize, query);
    if (apiResponse) {
      setUnitData({
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

  async function createAndModifyUnit(type, dataForm) {
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createUnit(dataForm);
      if (apiResponse) {
        getDataUnit();
        handleShowModal(false);

        updateStoreUnit(type, apiResponse);
        toast(CONSTANTS.SUCCESS, `${t('THEM_MOI')} ${t('UNIT')} ${t('THANH_CONG')}`);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      const apiResponse = await updateUnitById(state.itemSelected._id, dataForm);
      if (apiResponse) {
        const docs = unit.docs.map(doc => doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc);
        setUnitData(Object.assign({}, unit, { docs }));
        handleShowModal(false);

        updateStoreUnit(type, apiResponse);
        toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('UNIT')} ${t('THANH_CONG')}`);
      }
    }
  }

  async function handleDelete(itemSelected) {
    const apiResponse = await deleteUnit(itemSelected._id);
    if (apiResponse) {
      await getDataUnit(calPageNumberAfterDelete(unit));

      updateStoreUnit(CONSTANTS.DELETE, apiResponse);
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('UNIT')} ${t('THANH_CONG')}`);
    }
  }

  function renderDataCol(value) {
    return (
      <>
        <div>{value.phone}</div>
        <div>{value.email}</div>
        <div>{value.address}</div>
      </>
    )
  }

  const columns = [
    columnIndex(unit.pageSize, unit.currentPage),
    { title: t('UNIT_NAME'), dataIndex: 'name', width: 150, sorter: true },
    // { title: t('UNIT_ADDRESS'), dataIndex: 'address', width: 150, sorter: true },
    { title: t('MA_DON_VI'), dataIndex: 'code', width: 150, sorter: true },
    {
      title: t('CAP_DON_VI'),
      dataIndex: 'level',
      render: (value) => (Object.values(ORG_UNIT_TYPE).find(orgUnit => orgUnit.value === value)?.label),
      width: 150,
      sorter: true
    },
    {
      title: t('CONTACT'),
      width: 250,
      render: (value) => renderDataCol(value)
    },
    {
      align: 'center',
      render: (value) => {
        const allowUpdate = permission.update;
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
        />;
      },
      fixed: 'right',
      width: 200,
    },
  ];

  function handleEdit(itemSelected) {
    setState({ isShowModal: true, itemSelected });
  }

  return (
    // <Tabs size="small"
    // onChange={setActiveKey} activeKey={activeKey}
    // >
    //   <Tabs.TabPane tab={t('Dạng cây')} key="1">
    //     <UnitTree/>
    //   </Tabs.TabPane>
    //   <Tabs.TabPane tab={t('Dạng bảng')} key="2">
    <div>
      {
        myOrgUnit?.level === 4 ? <Filter
          dataSearch={[
            { name: 'name', label: t('UNIT_NAME'), type: CONSTANTS.TEXT },
          ]}
          handleFilter={(query) => getDataUnit(1, unit.pageSize, query)}
          labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
        />
          :
          <Filter
            dataSearch={[
              { name: 'name', label: t('UNIT_NAME'), type: CONSTANTS.TEXT },
              {
                name: 'level',
                label: t('CAP_DON_VI'),
                type: CONSTANTS.SELECT,
                options: {
                  data: Object.values(ORG_UNIT_TYPE).filter(orgUnit => orgUnit?.level > myOrgUnit?.level),
                  valueString: "_id",
                  labelString: "name"
                }
              },
            ]}
            handleFilter={(query) => getDataUnit(1, unit.pageSize, query)}
            labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
          />
      }

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission} />
      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={unit.docs}
          pagination={paginationConfig(getDataUnit, unit)}
          scroll={{ x: 'max-content' }}
          onChange={async (pagination, filters, sorter, extra) => {
            if (extra.action === 'sort') {
              const sortObj = cloneObj(unit.query);
              if (sorter.order) {
                sortObj.sort = `${sorter.order === 'ascend' ? '' : '-'}${snakeCase(sorter.column.dataIndex)}`;
              } else {
                delete sortObj.sort;
              }
              await getDataUnit(unit.currentPage, unit.pageSize, sortObj);
            }
          }}
        />
      </Loading>
      <CreateOrModifyUnit
        permission={permission}
        type={!!state.itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyUnit}
        handleCancel={() => handleShowModal(false)}
        itemSelected={state.itemSelected}
      />
    </div>
    //   </Tabs.TabPane>
    // </Tabs>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.unit;
  const { isLoading } = store.app;
  const { unitList } = store.unit;
  const { myInfo } = store.user;
  const myOrgUnit = Object.values(ORG_UNIT_TYPE).find(unit => unit.value === myInfo?.unitId?.level);
  return { permission, isLoading, unitList, myInfo, myOrgUnit };
}

export default withTranslation()(connect(mapStateToProps, { ...unit.actions })(Unit));
