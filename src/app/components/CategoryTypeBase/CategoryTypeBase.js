import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'antd';

import Loading from '@components/Loading';
import Filter from '@components/Filter';
import AddNewButton from '@AddNewButton';
import CreateOrModifyCategoryTypeBase from './CreateOrModifyCategoryTypeBase';
import ActionCell from '@components/ActionCell';

import { CONSTANTS } from '@constants';
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertObjToSnakeCase,
  convertQueryToObject,
  handleReplaceUrlSearch,
  paginationConfig,
  toast,
} from '@app/common/functionCommons';
import updateDataStore from '@app/common/updateDataStore';
import { t } from 'i18next';

function CategoryTypeBase({ permission, isLoading, categoryTypeBaseList, ...props }) {
  const { titleBase, titleShorten, setCategoryTypeBase } = props;
  const { createCategoryTypeBase, deleteCategoryTypeBase, getAllCategoryTypeBase, updateCategoryTypeBase } = props;

  const [typeDataBase, setTypeDataBase] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  const [state, setState] = useState({
    isShowModal: false,
    categoryTypeBaseSelected: null,
  });

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataCategoryTypeBase(page, limit, queryObj);
    })();
  }, []);

  async function getDataCategoryTypeBase(
    currentPage = typeDataBase.currentPage,
    pageSize = typeDataBase.pageSize,
    query = typeDataBase.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllCategoryTypeBase(currentPage, pageSize, query);
    if (apiResponse) {
      setTypeDataBase({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
        query: query,
      });
    }
  }

  function handleShowModal(isShowModal, categoryTypeBaseSelected = null) {
    if (isShowModal) {
      setState({ isShowModal, categoryTypeBaseSelected });
    } else {
      setState({ ...state, isShowModal });
    }
  }

  function handleEdit(categoryTypeBaseSelected) {
    setState({ isShowModal: true, categoryTypeBaseSelected });
  }

  async function handleDelete(categoryTypeBaseSelected) {
    const apiResponse = await deleteCategoryTypeBase(categoryTypeBaseSelected._id);
    if (apiResponse) {
      await getDataCategoryTypeBase(calPageNumberAfterDelete(typeDataBase));
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${titleBase} ${t('THANH_CONG')}`);
      updateStoreCategoryTypeBase(CONSTANTS.DELETE, apiResponse);
    }
  }

  // function create or modify
  async function createOrModifyCategoryTypeBase(type, dataForm) {
    const dataRequest = convertObjToSnakeCase(dataForm);

    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createCategoryTypeBase(dataRequest);
      if (apiResponse) {
        getDataCategoryTypeBase();
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('THEM_MOI')} ${titleBase} ${t('THANH_CONG')}`);
        updateStoreCategoryTypeBase(type, apiResponse);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      dataRequest._id = state.categoryTypeBaseSelected._id;
      const apiResponse = await updateCategoryTypeBase(dataRequest);
      if (apiResponse) {
        const docs = typeDataBase.docs.map(doc => {
          if (doc._id === apiResponse._id) {
            doc = apiResponse;
          }
          return doc;
        });
        setTypeDataBase(Object.assign({}, typeDataBase, { docs }));
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${titleBase} ${t('THANH_CONG')}`);
        updateStoreCategoryTypeBase(type, apiResponse);
      }
    }
  }

  function updateStoreCategoryTypeBase(type, dataResponse) {
    if (!type || !dataResponse || !categoryTypeBaseList.length) return;
    const categoryTypeBaseUpdated = updateDataStore(type, categoryTypeBaseList, dataResponse);
    setCategoryTypeBase(categoryTypeBaseUpdated);
  }

  function handleChangePagination(current, pageSize) {
    getDataCategoryTypeBase(current, pageSize);
  }

  const dataSource = typeDataBase.docs;

  const columns = [
    columnIndex(typeDataBase.pageSize, typeDataBase.currentPage),
    { title: titleShorten || titleBase, dataIndex: 'tenLoai', width: 270 },
    {
      title: t('MAU_TREN_BAN_DO'), dataIndex: 'color', width: 100, align: 'center',
      render: value => <div className="d-flex">
        <div style={{ width: 50, height: 22, backgroundColor: value, margin: 'auto' }}/>
      </div>,
    },
    { title: t('THU_TU'), dataIndex: 'thuTu', align: 'center', width: 80 },
    { title: t('GHI_CHU'), dataIndex: 'ghiChu', width: 200 },
    {
      align: 'center',
      render: (value) => <ActionCell
        value={value}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        permission={permission}/>,
      fixed: 'right',
      width: 200,
    },
  ];

  const pagination = paginationConfig(handleChangePagination, typeDataBase);

  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'tenLoai', label: titleShorten || titleBase, type: CONSTANTS.TEXT },
        ]}
        handleFilter={(query) => getDataCategoryTypeBase(1, typeDataBase.pageSize, query)}
      />

      <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission}/>
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
      <CreateOrModifyCategoryTypeBase
        type={!!state.categoryTypeBaseSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createOrModifyCategoryTypeBase}
        handleCancel={() => handleShowModal(false)}
        categoryTypeBaseSelected={state.categoryTypeBaseSelected}
        titleBase={titleBase}
        isLoading={isLoading}
        permission={permission}
      />
    </div>
  );
}

export default withRouter(CategoryTypeBase);
