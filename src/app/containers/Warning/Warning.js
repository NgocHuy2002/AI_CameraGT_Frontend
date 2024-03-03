// import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { Table, Popover, Image, Tag } from 'antd';

// import { URL } from '@url';

// import ActionCell from '@components/ActionCell';
// import Filter from '@components/Filter';
// import Loading from '@components/Loading'
// import { snakeCase } from 'lodash';

// import { getAllWarning, deleteWarning } from '../../services/Warning';

// import { CONSTANTS, TRANG_THAI_XAC_NHAN, TRANG_THAI_KIEM_TRA, OBJECT } from '@constants';
// import {
//   calPageNumberAfterDelete,
//   columnIndex,
//   convertQueryToObject,
//   handleReplaceUrlSearch,
//   paginationConfig,
//   cloneObj, toast,
//   formatDateTime
// } from '@app/common/functionCommons';

// import TagAction from '@components/TagAction';
// import { EditOutlined, EyeOutlined } from '@ant-design/icons';
// import { t } from 'i18next';
// import { withTranslation } from 'react-i18next';

// import * as unit from '@app/store/ducks/unit.duck';
// import * as powerline from '@app/store/ducks/powerline.duck';
// import * as position from '@app/store/ducks/position.duck';

// import DropzoneImage from '@components/DropzoneImage';

// function Warning({ unitList, powerlineList, positionList, permission, isLoading, ...props }) {
//   const [powerline, setPowerline] = useState([]);
//   const [position, setPosition] = useState([]);

//   useEffect(() => {
//     if (!powerlineList) {
//       props.getAllPowerline();
//     }
//     if (!unitList) {
//       props.getAllUnit();
//     }
//     if (!positionList) {
//       props.getAllPosition();
//     }
//   }, []);

//   const [warningData, setWarningData] = useState({
//     docs: [],
//     currentPage: 1,
//     pageSize: 10,
//     totalDocs: 0,
//     query: {},
//   });

//   useEffect(() => {
//     (async () => {
//       const { page, limit, ...queryObj } = convertQueryToObject(props.history.location.search);
//       await getDataWarning(page, limit, queryObj);
//     })();
//   }, []);

//   async function getDataWarning(
//     currentPage = warningData.currentPage,
//     pageSize = warningData.pageSize,
//     query = warningData.query,
//   ) {
//     handleReplaceUrlSearch(props.history, currentPage, pageSize, query);
//     const apiResponse = await getAllWarning(currentPage, pageSize, query);

//     if (apiResponse) {
//       setWarningData({
//         docs: apiResponse.docs,
//         totalDocs: apiResponse.totalDocs,
//         pageSize: apiResponse.limit,
//         currentPage: apiResponse.page,
//         query: query,
//       });
//     }
//   }

//   async function handleDelete(itemSelected) {
//     const apiResponse = await deleteWarning(itemSelected._id);
//     if (apiResponse) {
//       await getDataWarning(calPageNumberAfterDelete(warningData));
//       toast(CONSTANTS.SUCCESS, `${t('XOA')} ${t('WARNING')} ${t('THANH_CONG')}`);
//     }
//   }

//   function renderDataWarningInfo(value) {
//     return (
//       <>
//         {value?.positionId && <div><b>{t('POSITION')}</b>: {value?.positionId?.name}</div>}
//         {value?.powerlineId && <div><b>{t('POWERLINE')}</b>: {value?.powerlineId?.name}</div>}
//         {value?.unitId && <div><b>{t('UNIT')}</b>: {value?.unitId?.name || value?.unitId?.name}</div>}
//       </>
//     )
//   }

//   function renderDataObject(value) {
//     value = value.replaceAll('\'', '"');
//     const arrObject = JSON.parse(value);
//     return (
//       <div>
//         {arrObject.map((item, index) => {
//           return <p key={index} style={{ margin: 0, padding: 0 }}>{t(item.label.toUpperCase())}</p>
//         })}
//       </div>
//     )
//   }

//   const columns = [
//     columnIndex(warningData.pageSize, warningData.currentPage),
//     {
//       align: 'center',
//       title: t('IMAGE'),
//       dataIndex: 'imageId',
//       width: 100,
//       render: (value) => {
//         const content = (
//           <div>
//             <DropzoneImage
//               width={250}
//               imgUrl={value}
//               allowChange={false}
//               warningImage={true}
//             />
//           </div>
//         );
//         return <>
//           <Popover content={content} title={null}>
//             <DropzoneImage
//               width={80}
//               height={45}
//               imgUrl={value}
//               allowChange={false}
//               warningImage={true}
//             />
//           </Popover>
//         </>
//       }
//     },
//     { title: t('CONTENT_WARNING'), dataIndex: 'content', width: 250, sorter: true },
//     {
//       title: t('OBJECT'),
//       dataIndex: 'object',
//       width: 150,
//       sorter: true,
//       render: (value) => renderDataObject(value)
//     },
//     {
//       title: t('NAME_CAMERA'),
//       dataIndex: 'cameraId',
//       width: 200,
//       sorter: true,
//       render: (value) => value?.name || ''
//     },
//     {
//       title: t('CAMERA_INFO'),
//       dataIndex: 'cameraId',
//       width: 300,
//       render: (value) => renderDataWarningInfo(value)
//     },
//     {
//       align: 'center',
//       title: t('CONFIRM_STATUS'),
//       dataIndex: 'confirmStatus',
//       width: 130,
//       render: value => {
//         return Object.entries(TRANG_THAI_XAC_NHAN).map(([key, status]) => {
//           if (key === value) {
//             return <Tag color={status?.color} className="m-0" key={status?._id}
//               style={{ width: 130 }}>{status?.name}</Tag>;
//           }
//         });
//       },
//     },
//     {
//       align: 'center',
//       title: t('CHECK_STATUS'),
//       dataIndex: 'checkStatus',
//       width: 140,
//       render: value => {
//         let valueConfirmStatus = '';

//         if (value === true) {
//           valueConfirmStatus = TRANG_THAI_KIEM_TRA.DA_KIEM_TRA._id
//         }
//         if (value === false) {
//           valueConfirmStatus = TRANG_THAI_KIEM_TRA.CHUA_KIEM_TRA._id
//         }

//         return Object.entries(TRANG_THAI_KIEM_TRA).map(([key, status]) => {
//           if (key === valueConfirmStatus) {
//             return <Tag color={status?.color} className="m-0" key={status?._id}
//               style={{ width: 120 }}>{status?.name}</Tag>;
//           }
//         });
//       },
//     },
//     {
//       title: t('CHECK_RESULT'),
//       dataIndex: 'checkResult',
//       width: 250
//     },
//     {
//       align: 'center',
//       title: t('DATE'),
//       dataIndex: 'createdAt',
//       width: 250,
//       render: (value) => formatDateTime(value)
//     },
//     {
//       align: 'center',
//       render: (value) => {
//         const allowUpdate = permission.update;
//         return <ActionCell
//           prefix={<TagAction
//             style={{ width: 95 }}
//             linkTo={{ pathname: URL.WARNING_ID.format(value?._id), permission: permission }}
//             icon={allowUpdate ? <EditOutlined /> : <EyeOutlined />}
//             label={<label style={{ paddingLeft: allowUpdate ? 6 : 3 }}>
//               {allowUpdate ? t('CHINH_SUA') : t('XEM_CHI_TIET')}
//             </label>}
//             color={allowUpdate ? 'cyan' : 'geekblue'}
//           />}
//           value={value}
//           handleDelete={handleDelete}
//           permission={{ delete: permission.delete }}
//         />;
//       },
//       fixed: 'right',
//       width: 200,
//     },
//   ];

//   return (
//     <div>
//       <Filter
//         dataSearch={[
//           {
//             name: 'unitId',
//             label: t('UNIT'),
//             type: CONSTANTS.SELECT,
//             options: {
//               data: unitList,
//               valueString: "_id",
//               labelString: "name"
//             },
//             onChange: (e) => {
//               const data = powerlineList.filter(item => item.unitId._id === e);
//               setPowerline(data);
//             }
//           },
//           {
//             name: 'powerlineId',
//             label: t('POWERLINE'),
//             type: CONSTANTS.SELECT,
//             options: {
//               data: powerline,
//               valueString: "_id",
//               labelString: "name"
//             },
//             onChange: (e) => {
//               const data = positionList.filter(item => item.powerlineId._id === e);
//               setPosition(data);
//             }
//           },
//           {
//             name: 'positionId',
//             label: t('POSITION'),
//             type: CONSTANTS.SELECT,
//             options: {
//               data: position,
//               valueString: "_id",
//               labelString: "name"
//             }
//           },
//           {
//             name: 'confirmStatus',
//             label: t('CONFIRM_STATUS'),
//             type: CONSTANTS.SELECT,
//             options: {
//               data: Object.values(TRANG_THAI_XAC_NHAN),
//               valueString: '_id',
//               labelString: 'name',
//             }
//           },
//           {
//             name: 'checkStatus',
//             label: t('CHECK_STATUS'),
//             type: CONSTANTS.SELECT,
//             options: {
//               data: Object.values(TRANG_THAI_KIEM_TRA),
//               valueString: '_id',
//               labelString: 'name',
//             }
//           },
//           {
//             name: 'object',
//             label: t('OBJECT'),
//             type: CONSTANTS.SELECT,
//             options: {
//               data: Object.values(OBJECT),
//               valueString: 'label',
//               labelString: 'value',
//             }
//           }
//         ]}
//         handleFilter={(query) => getDataWarning(1, warningData.pageSize, query)}
//         labelCol={{ xs: 24, sm: 6, md: 7, lg: 7, xl: 8, xxl: 8 }}
//       />


//       <Loading active={isLoading}>
//         <Table
//           size="small"
//           bordered
//           columns={columns}
//           dataSource={warningData.docs}
//           pagination={paginationConfig(getDataWarning, warningData)}
//           scroll={{ x: 'max-content' }}
//           onChange={async (pagination, filters, sorter, extra) => {
//             if (extra.action === 'sort') {
//               const sortObj = cloneObj(warningData.query);
//               if (sorter.order) {
//                 sortObj.sort = `${sorter.order === 'ascend' ? '' : '-'}${snakeCase(sorter.column.dataIndex)}`;
//               } else {
//                 delete sortObj.sort;
//               }
//               await getDataWarning(warningData.currentPage, warningData.pageSize, sortObj);
//             }
//           }}
//         />
//       </Loading>
//     </div>
//   );
// }

// function mapStateToProps(store) {
//   const permission = store.user.permissions?.cameraType;
//   const { isLoading } = store.app;
//   const { unitList } = store.unit;
//   const { powerlineList } = store.powerline;
//   const { positionList } = store.position;
//   return { permission, isLoading, unitList, powerlineList, positionList };
// }

// const mapDispatchToProps = {
//   ...powerline.actions,
//   ...unit.actions,
//   ...position.actions,
// };


// export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Warning));
