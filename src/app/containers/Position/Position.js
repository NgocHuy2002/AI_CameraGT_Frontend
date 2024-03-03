import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Input } from 'antd';
import AddNewButton from '@AddNewButton';

import CreateOrModifyPosition from './CreateOrModifyPosition';

import ActionCell from '@components/ActionCell';
import Filter from '@components/Filter';
import Loading from '@components/Loading'
import { snakeCase } from 'lodash';

import { createPosition, getAllPosition, updatePositionById, deletePosition, insertManyPosition, downloadTemplate } from '../../services/Position'; 

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

import Dropzone from "react-dropzone";

import ListUploadPosition from './ListUploadPosition.js';

import * as unit from '@app/store/ducks/unit.duck';
import * as position from '@app/store/ducks/position.duck';

function Position({ unitList, permission, isLoading, ...props }) {
  const [stateUpload, setStateUpload] = useState({
    isShowModalUpload: false,
    dataUpload: [],
  });

  const [state, setState] = useState({
    isShowModal: false,
    itemSelected: null,
  });

  const [position, setPositionData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
    query: {},
  });

  useEffect(() => {
    if(!unitList){
      props.getAllUnit();
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
      await getDataPosition(page, limit, queryObj);
    })();
  }, []);

  async function getDataPosition(
    currentPage = position.currentPage,
    pageSize = position.pageSize,
    query = position.query,
  ) {
    handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
    const apiResponse = await getAllPosition(currentPage, pageSize, query);
    if (apiResponse) {
      setPositionData({
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

  function handleShowModalUpload(isShowModalUpload, dataUpload = null) {
    if (isShowModalUpload) {
      setStateUpload({ isShowModalUpload, dataUpload });
    } else {
      setStateUpload({ ...state, isShowModalUpload });
    }
  }

  async function createAndModifyPosition(type, dataForm) {
    if (type === CONSTANTS.CREATE) {
      const apiResponse = await createPosition(dataForm);
      if (apiResponse) {
        const docs = position.docs.map(doc => doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc);
        setPositionData(Object.assign({}, position, { docs }));
        getDataPosition();
        handleShowModal(false);
        props.setPosition(docs);
        toast(CONSTANTS.SUCCESS, `${t('TAO_MOI')} ${t('POSITION')} ${t('THANH_CONG')}`);
      }
    }

    if (type === CONSTANTS.UPDATE) {
      const apiResponse = await updatePositionById(state.itemSelected._id, dataForm);
      if (apiResponse) {
        const docs = position.docs.map(doc => doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc);
        setPositionData(Object.assign({}, position, { docs }));
        props.setPosition(docs);
        handleShowModal(false);
        toast(CONSTANTS.SUCCESS, `${t('CHINH_SUA')} ${t('POSITION')} ${t('THANH_CONG')}`);
      }
    }
  }

  async function createUploadPosition(dataForm, isShowModalUpload=false){
    await insertManyPosition(dataForm);
    getDataPosition(1, position.pageSize, {});
    if(!isShowModalUpload){
      setStateUpload({ isShowModalUpload: false , dataUpload: [] });
    }
  }

  async function handleDelete(itemSelected) {
    const apiResponse = await deletePosition(itemSelected._id);
    if (apiResponse) {
      const docs = position.docs.map(doc => doc._id === apiResponse._id ? { ...doc, ...apiResponse } : doc);
      await getDataPosition(calPageNumberAfterDelete(position));
      props.setPosition(docs);
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('POSITION')} ${t('THANH_CONG')}`);
    }
  }

  const columns = [
    columnIndex(position.pageSize, position.currentPage),
    { title: t('POSITION_NAME'), dataIndex: 'name', width: 150, sorter: true },
    { 
      title: t('UNIT'), 
      width: 150, 
      dataIndex: 'unitId',
      sorter: true ,
      render: (value) => {
        return value?.name || ''
      }
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

  function onDrop(files){
    let rowObj = [];
    let file = files[0];
    const reader = new FileReader();
  
    reader.onload = async () => {
      const dataExcel = reader.result;
      var wb = XLSX.read(dataExcel, { type: "binary" });
      wb.SheetNames.forEach(function (sheetName) {
        rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
        // rowObj.splice(0, 1);
      });
      let data = [];
      let dataError = [];
      let countSuccess = 0;
      let countError = 0;
      rowObj.map((item, index) => {
        const code = `id${index}`;
        const name = item['Tên vị trí'] ? item['Tên vị trí'] : null;

        const unit = item['Đơn vị'] ? unitList.find(e => removeSpaceAndSign(e.name) === removeSpaceAndSign(item['Đơn vị'])) : null;
        const unitId =  unit?._id || ''; 

        const lat = item['Vĩ độ'] ? item['Vĩ độ'] : null;
        const long = item['Kinh độ'] ? item['Kinh độ'] : null;

        if(!unitId){
          dataError.push({code, name, unit, unitId, isDeleted: false, arrUnit: unitList, lat, long})
          countError++;
        } else {
          data.push({code, name, unit, unitId, isDeleted: false, lat, long})
          countSuccess++;
        }
      })
      if(data.length > 0){
        await insertManyPosition(data);
        getDataPosition(1, position.pageSize, {});
      }
      if(dataError.length > 0){
        toast(CONSTANTS.WARNING, `${t('TAO_MOI')} ${countError} ${t('POSITION')} ${t('THAT_BAI')} và ${countSuccess} ${t('POSITION')} ${t('THANH_CONG')}`);
        setStateUpload({
          isShowModalUpload: !stateUpload.isShowModalUpload,
          dataUpload: dataError
        })
      } else {
        toast(CONSTANTS.SUCCESS, `${t('TAO_MOI')} ${t('POSITION')} ${t('THANH_CONG')}`);
      }
    }
    reader.readAsBinaryString(file);
  }

  function removeSpaceAndSign(str) {
    if (str) {
      str = str.toLowerCase();
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      str = str.replace(/đ/g, 'd');
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'a');
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'e');
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'i');
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'o');
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'u');
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'y');
      str = str.replace(/Đ/g, 'd');
      str = str.replace(/\s/g, '');
      str = str.replace(/ /g, '');
      str = str.replace(/\s+/g, ' ');
    }
    return str;
  }

  return (
    <div>
      <Filter
        dataSearch={[
          { name: 'name', label: t('POSITION_NAME'), type: CONSTANTS.TEXT },
          { 
            name: 'unitId', 
            label: t('UNIT'), 
            type: CONSTANTS.SELECT, 
            options: { 
              data: unitList,
              valueString: "_id",
              labelString: "name"
            }
          }
        ]}
        handleFilter={(query) => getDataPosition(1, position.pageSize, query)}
        labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
      />
      <Form className="form-horizontal" style={{display: 'flex', justifyContent: 'flex-end'}}>
        {permission.create && <>
          <Dropzone
            disabled={false}
            onDrop={onDrop}
            accept=".xlsx"
            className="dropzone-main text-center"
            multiple={false}
          >
            {({getRootProps, getInputProps}) => (
              <span className="btn btn-xs text-primary pull-right" style={{ cursor: 'pointer' }}>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <i className="fa fa-upload" aria-hidden="true">
                    &nbsp;Tải lên dữ liệu
                  </i>
                </div>
              </span>
            )}
            
          </Dropzone>

          <button onClick={async () => await downloadTemplate()} style={{ border: 'none', background: 'none', display: 'flex', cursor: 'pointer' }}>
            <span className=" btn btn-xs pull-right mr-3 text-primary" color="primary">
              <i className="fa fa-download" aria-hidden="true">
                &nbsp;Tải xuống mẫu dữ liệu
              </i>
            </span>
          </button>
        </>}
        <AddNewButton onClick={() => handleShowModal(true)} disabled={isLoading} permission={permission}/>   
      </Form>
      <Loading active={isLoading}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={position.docs}
          pagination={paginationConfig(getDataPosition, position)}
          scroll={{ x: 'max-content' }}
          onChange={async (pagination, filters, sorter, extra) => {
            if (extra.action === 'sort') {
              const sortObj = cloneObj(position.query);
              if (sorter.order) {
                sortObj.sort = `${sorter.order === 'ascend' ? '' : '-'}${snakeCase(sorter.column.dataIndex)}`;
              } else {
                delete sortObj.sort;
              }
              await getDataPosition(position.currentPage, position.pageSize, sortObj);
            }
          }}
        />
      </Loading>
      <CreateOrModifyPosition
        dsUnit={unitList}
        permission={permission}
        type={!!state.itemSelected ? CONSTANTS.UPDATE : CONSTANTS.CREATE}
        isModalVisible={state.isShowModal}
        handleOk={createAndModifyPosition}
        handleCancel={() => handleShowModal(false)}
        itemSelected={state.itemSelected}
      />
      <ListUploadPosition 
        permission={permission}
        isModalVisible={stateUpload.isShowModalUpload}
        handleCancel={() => handleShowModalUpload(false)}
        handleOk={createUploadPosition}
        data={stateUpload.dataUpload}
        unitList={unitList}
      />
    </div>
  );
}

function mapStateToProps(store) {
  const permission = store.user.permissions?.position;
  const { isLoading } = store.app;
  const { unitList } = store.unit;
  return { permission, isLoading, unitList };
}

const mapDispatchToProps = {
  ...unit.actions,
  ...position.actions,
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Position));
