import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';

import AddNewButton from '@AddNewButton';

import CreateOrModifyCameraType from './CreateOrModifyCameraType';

import ActionCell from '@components/ActionCell';
import Filter from '@components/Filter';
import Loading from '@components/Loading'
import { snakeCase } from 'lodash';

import { createCameraType, getAllCameraType, updateCameraTypeById, deleteCameraType } from '../../services/CameraType'; 

import { CONSTANTS } from '@constants';
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

function CameraType({ permission, isLoading, myInfo, ...props }) {
  const [state, setState] = useState({
    isShowModal: false,
    itemSelected: null,
  });

  const [cameraTypeData, setCameraTypeData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataCameraType(page, limit, queryObj);
    })();
  }, []);

  async function getDataCameraType(
    currentPage = cameraTypeData.currentPage,
    pageSize = cameraTypeData.pageSize,
    query = cameraTypeData.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllCameraType(currentPage, pageSize, query);
    if (apiResponse) {
      setCameraTypeData({
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

  async function createAndModifyCameraType(type, dataForm) {
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createCameraType(dataForm);
      if (apiResponse) {
        getDataCameraType();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('TAO_MOI')} ${t('CAMERA_TYPE')} ${t('THANH_CONG')}`);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      const apiResponse = await updateCameraTypeById(state.itemSelected._id, dataForm);
      if (apiResponse) {
        const docs = cameraTypeData.docs.map(doc => doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc);
        setCameraTypeData(Object.assign({}, cameraTypeData, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('CAMERA_TYPE')} ${t('THANH_CONG')}`);
      }
    }
  }

  async function handleDelete(itemSelected) {
    const apiResponse = await deleteCameraType(itemSelected._id);
    if (apiResponse) {
      await getDataCameraType(calPageNumberAfterDelete(cameraTypeData));
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('CAMERA_TYPE')} ${t('THANH_CONG')}`);
    }
  }

  function renderDataCol( value) {
    if (typeof value === 'string' && value !== undefined) {
      const formattedValue = value.replace(/\n/g, '<br>');
      return {
        props: {
          style: { verticalAlign: 'top' },
        },
        children: <span dangerouslySetInnerHTML={{ __html: formattedValue }} />,
      };
    } else {
      return '';
    }
  }

  const columns = [
    columnIndex(cameraTypeData.pageSize, cameraTypeData.currentPage),
    { title: t('BRAND_CAMERA'), dataIndex: 'brand', width: 100, sorter: true },
    {
      title: t('DESCRIPTION'),
      dataIndex: 'description',
      width: 250,
      render: (value) => renderDataCol(value)
    },
    { title: t('Format'), dataIndex: 'formatRtsp', width: 250, hidden: !myInfo.isSystemAdmin },
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
    <div>
      <Filter
        dataSearch={[
          { name: 'brand', label: t('BRAND_CAMERA'), type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataCameraType(1, cameraTypeData.pageSize, query)}
        labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
      />

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission}/>
      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={columns.filter((col) => !col.hidden)}
          dataSource={cameraTypeData.docs}
          pagination={paginationConfig(getDataCameraType, cameraTypeData)}
          scroll={{ x: 'max-content' }}
          onChange={async (pagination, filters, sorter, extra) => {
            if (extra.action === 'sort') {
              const sortObj = cloneObj(cameraTypeData.query);
              if (sorter.order) {
                sortObj.sort = `${sorter.order === 'ascend' ? '' : '-'}${snakeCase(sorter.column.dataIndex)}`;
              } else {
                delete sortObj.sort;
              }
              await getDataCameraType(cameraTypeData.currentPage, cameraTypeData.pageSize, sortObj);
            }
          }}
        />
      </Loading>
      <CreateOrModifyCameraType
        permission={permission}
        type={!!state.itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyCameraType}
        handleCancel={() => handleShowModal(false)}
        itemSelected={state.itemSelected}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.cameraType;
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  return { permission, isLoading, myInfo };
}

export default withTranslation()(connect(mapStateToProps)(CameraType));
