import React, { useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import { connect } from 'react-redux';

import Loading from '@components/Loading';
import CustomModal from '@components/CustomModal';
import CustomSkeleton from '@components/CustomSkeleton';

import { CONSTANTS, RULES } from '@constants';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
import ActionCell from '@components/ActionCell';
import {
  calPageNumberAfterDelete,
  columnIndex,
  convertQueryToObject,
  handleReplaceUrlSearch,
  paginationConfig,
  cloneObj, toast
} from '@app/common/functionCommons';

function ListUploadPosition({ unitList, powerlineList, permission, isModalVisible, handleOk, handleCancel, data, ...props }) {
  const [dataUpload, setDataUpload] = useState([]);

  useEffect(() => {
    if (isModalVisible) {
      setDataUpload(data);
    }
  }, [isModalVisible]);

  function handleComfirm() {
    if (props.isLoading) return;
    let dataError = [];
    let dataSuccess = []
    dataUpload.map(e => {
      if( e.unitId && e.powerlineId){
        dataSuccess.push(e);
      } else{
        dataError.push(e);
      }
    })
    if(dataError && dataError.length > 0){
      setDataUpload(dataError);
    }
    if(dataSuccess.length > 0 && dataError.length > 0){
      toast(CONSTANTS.WARNING, `${t('TAO_MOI')} ${dataError.length} ${t('POSITION')} ${t('THAT_BAI')} và ${dataSuccess.length} ${t('POSITION')} ${t('THANH_CONG')}`);
    } if(dataSuccess.length > 0 && dataError.length === 0){
      toast(CONSTANTS.SUCCESS, `${t('TAO_MOI')} ${t('POSITION')} ${t('THANH_CONG')}`);
    } else {
      toast(CONSTANTS.ERROR, `${t('TAO_MOI')} ${dataError.length} ${t('POSITION')} ${t('THAT_BAI')}`);
    }
    if(dataSuccess && dataSuccess.length > 0){
      handleOk(dataSuccess, dataError.length > 0 ? true : false);
    }
  }

  function handleDelete(itemSelected) {
    let dataUploadCustom = [...dataUpload];
    let index = dataUpload.findIndex(e => e.code === itemSelected.code);
    if(index !== -1){
      dataUploadCustom.splice(index, 1);
      setDataUpload(dataUploadCustom);
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${count} ${t('POSITION')} ${t('THAT_BAI')}`);
    }
  }

  function renderSelectUnit(value){
    const options = value.arrUnit.map((item) => ({
      value: item._id,
      label: item.name,
    }))
    return (<Select
      value={value?.unitId || ''}
      style={{ width: 250 }}
      placeholder="Select"
      onChange={(item) => {
        let dataUploadCustom = [...dataUpload];
        let index = dataUpload.findIndex(e => e.code === value.code);
        let objUnit = unitList.find(e => e._id === item);

        let arrPowerline = powerlineList.filter(e => e.unitId && e.unitId._id === item);

        dataUploadCustom[index].unit = objUnit;
        dataUploadCustom[index].unitId = item;
        dataUploadCustom[index].arrPowerline = arrPowerline;
        dataUploadCustom[index].powerline = {};
        dataUploadCustom[index].powerlineId = '';
        setDataUpload(dataUploadCustom);
      }}
      options={options}
    />)
  }

  function renderSelectPowerline(value){
    const options = value.arrPowerline.map((item) => ({
      value: item._id,
      label: item.name,
    }))
    return (<Select
      value={value?.powerlineId || ''}
      style={{ width: 300 }}
      placeholder="Select"
      onChange={(item) => {
        let dataUploadCustom = [...dataUpload];
        let index = dataUpload.findIndex(e => e.code === value.code);
        let objPowerline = powerlineList.find(e => e._id === item);

        dataUploadCustom[index].powerline = objPowerline;
        dataUploadCustom[index].powerlineId = item;
        setDataUpload(dataUploadCustom);
      }}
      options={options}
    />)
  }


  const columns = [
    columnIndex(0, 1),
    { title: t('POSITION_NAME'), dataIndex: 'name', width: 150, sorter: true },
    { 
      title: t('UNIT'), 
      width: 250, 
      render: (value) => renderSelectUnit(value),
    },
    { 
      title: t('POWERLINE'), 
      width: 300, 
      render: (value) => renderSelectPowerline(value),
    },
    { title: t('Vĩ độ'), dataIndex: 'lat', width: 150, sorter: true },
    { title: t('Kinh độ'), dataIndex: 'long', width: 150, sorter: true },
    {
      align: 'center',
      render: (value) => {
        return <ActionCell
          value={value}
          handleDelete={handleDelete}
          permission={{ delete: permission.delete }}
        />;
      },
      fixed: 'right',
      width: 200,
    },
  ];

  return (<>
    <CustomModal
      width="920px"
      title={t('UPLOAD_POSITION_ERROR')}
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={handleComfirm}
      isLoadingSubmit={props.isLoading}
      isDisabledClose={props.isLoading}
      formId="form-upload-position"
    >
      <Loading active={props.isLoading}>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={dataUpload}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </Loading>
    </CustomModal>
  </>);
}

function mapStateToProps(store) {
  const { isLoading } = store.app;
  return { isLoading };
}

export default withTranslation()(connect(mapStateToProps)(ListUploadPosition));
