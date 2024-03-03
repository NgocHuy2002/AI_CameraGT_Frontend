import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Form, Popconfirm, Row, Table, Tree } from 'antd';
import { CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined, SaveFilled } from '@ant-design/icons';
import { connect } from 'react-redux';

import Loading from '@components/Loading';
import CustomSkeleton from '@components/CustomSkeleton';
import TagAction from '@components/TagAction';

import { CONSTANTS, ORG_UNIT_TYPE, RULES } from '@constants';
import { getAllUser } from '@app/services/User';
import { createUnit, deleteUnit, updateUnit } from '@app/services/OrgUnit';
import { cloneObj, paginationConfig, randomKey, toast } from '@app/common/functionCommons';
import updateDataStore from '@app/common/updateDataStore';
import checkUserPermission from '@app/rbac/checkUserPermission';
import { create } from '@app/rbac/permissionHelper';
import resources from '@app/rbac/resources';
import actions from '@app/rbac/actions';

import * as orgUnit from '@app/store/ducks/orgUnit.duck';

import './UnitTree.scss';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';

function UnitTree({ isLoading, myInfo, myOrgUnit, orgUnitTree, orgUnitList, ...props }) {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const [form] = Form.useForm();

  const [allowEditing, setAllowEditing] = useState(false);
  const [orgUnitSelected, setOrgUnitSelected] = useState(null);

  const [orgUnitTreeData, setOrgUnitTreeData] = useState([]);

  const [parentKey, setParentKey] = useState(false);
  const [userData, setUserData] = useState({
    docs: [],
    currentPage: 1,
    pageSize: 10,
    totalDocs: 0,
  });

  useEffect(() => {
    if (!orgUnitList?.length) {
      props.getOrgUnit();
    }
    if (!orgUnitTree?.length) {
      props.getOrgUnitTree();
    }

  }, []);

  useEffect(() => {
    function formatTreeData(treeData) {
      return treeData.map(nodeData => ({
        ...nodeData,
        title: nodeData.name,
        children: formatTreeData(nodeData.children),
      }));
    }

    if (orgUnitTree?.length) {
      setOrgUnitTreeData(formatTreeData(orgUnitTree));
    }
  }, [orgUnitTree]);

  function handleDataDetail(dataInput) {
    const fieldData = cloneObj(dataInput);
    const capDonViObject = Object.values(ORG_UNIT_TYPE).find(orgUnit => orgUnit.value === fieldData?.level);
    if (capDonViObject?.label) {
      fieldData.levelName = t(capDonViObject.value);
    }
    if (fieldData?.parentId?._id) {
      fieldData.parentId = orgUnitSelected.parentId._id;
      fieldData.parentName = orgUnitSelected.parentId.name;
    }
    return fieldData;
  }

  useEffect(() => {
    form.resetFields();
    const fieldData = handleDataDetail(orgUnitSelected);
    form.setFieldsValue(fieldData);
  }, [orgUnitSelected]);

  function updateStoreUnit(type, dataResponse) {
    if (!type || !dataResponse || !orgUnitList.length) return;
    const unitListUpdated = updateDataStore(type, orgUnitList, dataResponse);
    props.setOrgUnit(unitListUpdated);
    props.getOrgUnitTree();
  }

  async function getDataUser(
    currentPage = userData.currentPage,
    pageSize = userData.pageSize,
    orgUnitId = null,
  ) {
    const apiResponse = await getAllUser(currentPage, pageSize, { unitId: orgUnitId || orgUnitSelected?._id });
    if (apiResponse) {
      setUserData({
        docs: apiResponse.docs,
        totalDocs: apiResponse.totalDocs,
        pageSize: apiResponse.limit,
        currentPage: apiResponse.page,
      });
    }
  }

  function handleAddOrgUnit(valueSelected = null) {
    if (!valueSelected) return;
    setOrgUnitSelected(valueSelected);
    setAllowEditing(true);
    setParentKey(null);
  }

  function handleSelectUnit(valueSelected) {
    if (!valueSelected || allowEditing) return;
    setOrgUnitSelected(valueSelected);
    setParentKey(Object.values(ORG_UNIT_TYPE).find(orgUnitType => orgUnitType.value === valueSelected.level)?.parentKey);
    getDataUser(1, 10, valueSelected?._id);
  }

  async function handleSaveData(values) {
    const dataRequest = cloneObj(values);
    let apiResponse;
    let messageString;
    let typeRequest;
    if (orgUnitSelected?._id) {
      dataRequest._id = orgUnitSelected._id;
      apiResponse = await updateUnit(dataRequest);
      messageString = `${t('CHINH_SUA')} ${t('DON_VI')} ${t('THANH_CONG')}`;
      typeRequest = CONSTANTS.UPDATE;
    } else {
      apiResponse = await createUnit(dataRequest);
      messageString = `${t('THEM_MOI')} ${t('DON_VI')} ${t('THANH_CONG')}`;
      typeRequest = CONSTANTS.CREATE;
    }

    if (apiResponse) {
      setAllowEditing(false);
      form.resetFields();
      setOrgUnitSelected(apiResponse);

      const fieldData = cloneObj(apiResponse);
      if (fieldData?.parentId?._id) {
        fieldData.parentId = apiResponse.parentId._id;
        fieldData.parentName = apiResponse.parentId.name;
      }
      form.setFieldsValue(fieldData);

      updateStoreUnit(typeRequest, apiResponse);
      toast(CONSTANTS.SUCCESS, messageString);
    }
  }

  function toggleEditing() {
    setAllowEditing(!allowEditing);
  }

  function handleChangeOrgUnitType(value, option) {
    if (parentKey !== option?.extra?.parentKey) {
      setParentKey(option?.extra?.parentKey);
      form.resetFields(['parentId', 'parentName']);
    }
  }

  function cancelEditing() {
    const fieldData = handleDataDetail(orgUnitSelected);
    form.resetFields();
    form.setFieldsValue(fieldData);
    if (!orgUnitSelected?._id) {
      setOrgUnitSelected(null);
    }
    setParentKey(Object.values(ORG_UNIT_TYPE).find(orgUnitType => orgUnitType.value === fieldData.level)?.parentKey);
    setAllowEditing(false);
  }

  function handleChangePagination(current, pageSize) {
    getDataUser(current, pageSize);
  }

  async function handleDelete(orgUnitSelected) {
    const apiResponse = await deleteUnit(orgUnitSelected._id);
    if (apiResponse) {
      toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('DON_VI')} ${t('THANH_CONG')}`);
      updateStoreUnit(CONSTANTS.DELETE, apiResponse);
      setOrgUnitSelected(null);
      form.resetFields();
    }
  }

  const columns = [
    { title: t('TEN'), dataIndex: 'fullName' },
    {
      title: t('VAI_TRO'), dataIndex: 'roleId',
      render: value => {
        if (Array.isArray(value)) {
          return value.map(item => {
            return <div key={item._id}>{item?.name}</div>;
          });
        }
      },
    },
    { title: t('SO_DIEN_THOAI'), dataIndex: 'phone' },
    { title: 'Email', dataIndex: 'email' },
  ];

  function checkAllowUpdateOrgUnitType() {
    if (!allowEditing) return false;
    if (!orgUnitSelected?._id) return true;
    const orgUnitTypeSelected = Object.values(ORG_UNIT_TYPE).find(orgUnit => orgUnit.value === orgUnitSelected?.level);
    return myOrgUnit.level < orgUnitTypeSelected.level;
  }

  const orgUnitOptions = orgUnitList.filter(orgUnit => orgUnit?.level === parentKey).filter(orgUnit => orgUnit._id !== orgUnitSelected?._id);
  return (
    <div id="location-list">
      <Row gutter={15}>
        <Col span={8}>
          <Card
            className="card-to-chuc"
            title={<div>
              {t('TO_CHUC')}
              {checkUserPermission([create(resources.ORG_UNIT, actions.CREATE)]) && !allowEditing && <TagAction
                label={t('THEM_TO_CHUC')}
                className="float-right m-0"
                color="geekblue"
                icon={<i className="fa fa-plus" />}
                onClick={() => handleAddOrgUnit({ key: randomKey() })}
              />}
            </div>}
            bordered size="small">

            {!!orgUnitTreeData.length && <Tree
              className="custom-tree"
              showLine={{ showLeafIcon: false }}
              defaultExpandAll
              switcherIcon={<DownOutlined />}
              selectedKeys={[orgUnitSelected?._id]}
              onSelect={(e) => handleSelectUnit(orgUnitList.find(orgUnit => orgUnit.key === e?.[0]))}
              treeData={orgUnitTreeData}
            />}

          </Card>
        </Col>

        {orgUnitSelected && <Col span={16}>
          <Form
            id="form-org-unit" form={form}
            onFinish={handleSaveData} scrollToFirstError>
            <Card
              title={t('THONG_TIN_CHUNG')} bordered={false} size="small"
              extra={<>
                {checkUserPermission([create(resources.ORG_UNIT, actions.UPDATE)]) && !allowEditing &&
                  <TagAction label={t('CHINH_SUA')} color="cyan" onClick={toggleEditing} icon={<EditOutlined />} />}

                {allowEditing && <>
                  <TagAction label={t('HUY')} color="red" onClick={cancelEditing} icon={<CloseOutlined />} />
                  <TagAction
                    label={t('LUU')}
                    color="geekblue"
                    isSubmit
                    formId="form-org-unit"
                    icon={<SaveFilled />}
                  />
                </>}

                {checkUserPermission([create(resources.ORG_UNIT, actions.DELETE)]) && !allowEditing && <Popconfirm
                  title={t('XOA_DU_LIEU')}
                  onConfirm={() => handleDelete(orgUnitSelected)}
                  cancelText={t('HUY')} okText="Ok" okButtonProps={{ type: 'danger' }}>
                  <TagAction
                    label={t('XOA')}
                    color="red"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>}
              </>
              }>
              <Row>
                <CustomSkeleton
                  size="default"
                  showInputLabel={!allowEditing}
                  label={t('TEN_DON_VI')} name="name"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  rules={[RULES.REQUIRED]}
                  form={form}

                />
                <CustomSkeleton
                  size="default" className="pl-lg-3"
                  showInputLabel={!allowEditing}
                  label={t('MA_DON_VI')} name="code"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  rules={[RULES.REQUIRED]}
                  form={form}

                />
                <CustomSkeleton
                  size="default"
                  showInputLabel={!allowEditing}
                  label={t('MA_IN')} name="maIn"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  form={form}

                />
                <CustomSkeleton
                  size="default" className="pl-lg-3"
                  showInputLabel={!allowEditing}
                  label={t('DUONG_DAY_NONG')} name="phone"
                  type={CONSTANTS.TEXT}
                  rules={[RULES.PHONE]}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  form={form}
                  helpInline={false}
                />
                <CustomSkeleton
                  size="default"
                  showInputLabel={!allowEditing}
                  label="Email" name="email"
                  type={CONSTANTS.TEXT}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  rules={[RULES.EMAIL]}
                  form={form}
                  helpInline={false}
                />
                <CustomSkeleton
                  size="default" className="pl-lg-3"
                  showInputLabel={!allowEditing}
                  label="Fax" name="fax"
                  type={CONSTANTS.TEXT}
                  rules={[RULES.FAX]}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  form={form}
                  helpInline={false}
                />

                {checkAllowUpdateOrgUnitType()
                  ? <CustomSkeleton
                    size="default"
                    label={t('CAP_DON_VI')} name="level"
                    type={CONSTANTS.SELECT}
                    layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                    labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                    options={{ data: Object.values(ORG_UNIT_TYPE).filter(orgUnit => orgUnit.level > myOrgUnit.level) }}
                    rules={[RULES.REQUIRED]}
                    showSearch
                    onChange={handleChangeOrgUnitType}
                  />
                  : <CustomSkeleton
                    size="default"
                    showInputLabel
                    label={t('CAP_DON_VI')} name="levelName"
                    type={CONSTANTS.TEXT}
                    layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                    labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                  />}
                {parentKey && <>
                  {allowEditing && orgUnitOptions.length
                    ? <CustomSkeleton
                      size="default" className="pl-lg-3"
                      label={t('DON_VI_CHA')} name="parentId"
                      type={CONSTANTS.SELECT}
                      allowClear
                      layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                      labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                      options={{ data: orgUnitOptions, valueString: '_id', labelString: 'name' }}
                      rules={[RULES.REQUIRED]}
                      showSearch
                    />
                    : <CustomSkeleton
                      size="default" className="pl-lg-3"
                      label={t('DON_VI_CHA')} name="parentName"
                      layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                      labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                      type={CONSTANTS.TEXT}
                      showInputLabel={true}
                    />}

                </>}
              </Row>
              <Row>
                <CustomSkeleton
                  className={myInfo.isSystemAdmin ? "pl-lg-3" : null}
                  size="default"
                  showInputLabel={!allowEditing}
                  label={t('THU_TU')} name="thuTu"
                  type={CONSTANTS.NUMBER}
                  layoutCol={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
                  labelCol={{ xs: 6, sm: 8, md: 8, lg: 8, xl: 9, xxl: 6 }}
                />
              </Row>
            </Card>
          </Form>

          {orgUnitSelected?._id && <>
            <Divider orientation="left" className="my-2">{t('DANH_SACH_THANH_VIEN')}</Divider>
            <div style={{ textAlign: 'left' }}>
              <Loading active={isLoading}>
                <Table
                  className="px-2"
                  size="small"
                  columns={columns}
                  dataSource={userData.docs}
                  pagination={paginationConfig(handleChangePagination, userData)}
                  scroll={{ x: 'max-content' }}
                />
              </Loading>
            </div>
          </>}
        </Col>}
      </Row>

    </div>

  );
}


function mapStateToProps(store) {
  const { isLoading } = store.app;
  const { myInfo } = store.user;
  const { orgUnitList, orgUnitTree } = store.orgUnit;
  const myOrgUnit = Object.values(ORG_UNIT_TYPE).find(orgUnit => orgUnit.value === myInfo?.unitId?.level);

  return { isLoading, myInfo, myOrgUnit, orgUnitList, orgUnitTree };
}

export default withTranslation()(connect(mapStateToProps, { ...orgUnit.actions })(UnitTree));
