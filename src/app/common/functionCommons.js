import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React, { useState } from 'react';
import moment from 'moment';
import { Tag, Tooltip, TreeSelect } from 'antd';
import { camelCase, isEqual, isObject, kebabCase, snakeCase, transform } from 'lodash';
import queryString from 'query-string';
import * as toastify from 'react-toastify';

import { CONSTANTS, KIEU_DU_LIEU, PAGINATION_CONFIG, TOAST_MESSAGE, TOAST_SIGN_MESSAGE } from '@constants';
import { Link } from 'react-router-dom';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import TagAction from '@components/TagAction';
import { t } from 'i18next';

export function cloneObj(input = {}) {
  return JSON.parse(JSON.stringify(input));
}

function renderQuery(queryInput, queryAdd, firstCharacter) {
  let queryOutput = queryInput ? '&' : firstCharacter;
  queryOutput += queryAdd;
  return queryInput + queryOutput;
}

export function handleReplaceUrlSearch(history, page, limit, query) {
  const queryObj = cloneObj(query);
  delete queryObj.page;
  delete queryObj.limit;
  let search = '';
  if (page || page === 0) {
    search += search ? '&' : '';
    search += `page=${page}`;
  }
  if (limit || limit === 0) {
    search += search ? '&' : '';
    search += `limit=${limit}`;
  }
  if (Object.values(queryObj).length) {
    search += search.length > 1 ? '&' : '';
    search += convertObjectToQuery(queryObj);
  }
  history.replace({ search });
}

export function convertObjectToQuery(queryObj) {
  let query = '';
  const sortable = Object.fromEntries(
    Object.entries(queryObj).sort(([, a], [, b]) => a - b),
  );
  Object.entries(sortable).forEach(([key, value]) => {
    query += query ? '&' : '';
    query += `${kebabCase(key)}=${value}`;
  });
  return query;
}

export function convertQueryToObject(queryStr) {
  return convertSnakeCaseToCamelCase(queryString.parseUrl(queryStr).query);
}

export function convertUrl(queryObj, firstCharacter = '?') {
  if (typeof queryObj !== 'object') return '';
  queryObj = convertObjectToSnakeCase(queryObj);
  let query = '';
  const sortable = Object.fromEntries(
    Object.entries(queryObj).sort(([, a], [, b]) => a - b),
  );
  Object.entries(sortable).forEach(([key, value]) => {
    if (value) {
      query = renderQuery(query, `${key}=${value}`, firstCharacter);
    }
  });
  return query;
}

export function convertParam(queryObj, firstCharacter = '?') {
  if (typeof queryObj !== 'object') return '';
  queryObj = convertObjectToSnakeCase(queryObj);
  let query = '';
  const sortable = Object.fromEntries(
    Object.entries(queryObj).sort(([, a], [, b]) => a - b),
  );
  Object.entries(sortable).forEach(([key, value]) => {
    if (value) {
      if (key === CONSTANTS.POPULATE && Array.isArray(value)) {
        query = renderQuery(query, `${key}=${value.map(x => snakeCase(x))}`, firstCharacter);
      } else if (value === CONSTANTS.EXISTS) {
        query = renderQuery(query, key, firstCharacter);
      } else if (value === CONSTANTS.NOT_EXIST) {
        query = renderQuery(query, `!${key}`, firstCharacter);
      } else if (value === CONSTANTS.MONTH) {
        query = renderQuery(query, `${key}>=${moment().startOf('month').toISOString()}`, firstCharacter);
        query = renderQuery(query, `${key}<=${moment().endOf('month').toISOString()}`);
      } else if (value === CONSTANTS.QUARTER) {
        query = renderQuery(query, `${key}>=${moment().startOf('quarter').toISOString()}`, firstCharacter);
        query = renderQuery(query, `${key}<=${moment().endOf('quarter').toISOString()}`);
      } else if (value === CONSTANTS.YEAR) {
        query = renderQuery(query, `${key}>=${moment().startOf('year').toISOString()}`, firstCharacter);
        query = renderQuery(query, `${key}<=${moment().endOf('year').toISOString()}`);
      } else if (value === CONSTANTS.TIME_OPTIONS) {
        // do nothing
      } else if (['string', 'boolean'].includes(typeof value) || Array.isArray(value)) {
        if (!key.includes(CONSTANTS.HIDDEN.toLowerCase())) {
          query = renderQuery(query, `${key}=${value}`, firstCharacter);
        } else {
          query = renderQuery(query, value, firstCharacter);
        }
      } else if (typeof value === 'object') {
        if (value.hasOwnProperty('lt')) {
          query = renderQuery(query, `${key}<${value.lt}`, firstCharacter);
        }
        if (value.hasOwnProperty('lte')) {
          query = renderQuery(query, `${key}<=${value.lte}`, firstCharacter);
        }
        if (value.hasOwnProperty('gt')) {
          query = renderQuery(query, `${key}>${value.gt}`, firstCharacter);
        }
        if (value.hasOwnProperty('gte')) {
          query = renderQuery(query, `${key}>=${value.gte}`, firstCharacter);
        }
      }
    }
  });
  return query;
}

export function convertFileName(str) {
  if (!str) return '';

  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
  str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E');
  str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
  str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
  str = str.replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U');
  str = str.replace(/[ỲÝỴỶỸ]/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/\s+/g, ' ');
  str.trim();
  return str;
}

export function findMax(data) {
  if (!Array.isArray(data) || !data.length) return null;
  let max = typeof data[0] === 'number'
    ? data[0]
    : Array.isArray(data[0]) && data[0][0] ? data[0][0] : 0;
  data.forEach(item => {
    if (typeof item === 'number') {
      max = max < item ? item : max;
    }
    if (Array.isArray(item)) {
      item.forEach(itemChild => {
        max = max < itemChild ? itemChild : max;
      });
    }
  });
  return max;
}

export function setCookieToken(typeToken, jwtToken) {
  const tokenDecode = jwtDecode(jwtToken);
  if (tokenDecode.exp) {
    Cookies.set(typeToken, jwtToken, { expires: new Date(new Date(tokenDecode.exp * 1000)) });
  }
}

export function randomKey() {
  return Math.floor(Math.random() * 100000000000);
}

export function checkTokenExp(authToken) {
  if (!authToken) return;
  try {
    const exp = jwtDecode(authToken).exp;
    const now = Date.now().valueOf() / 1000;
    return now < exp;
  } catch (e) {
    return null;
  }
}

export function hexToRgb(hex) {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return result ? `rgb(${r}, ${g}, ${b})` : null;
}

export function getMessageError(err, method) {
  if (err && err.message === CONSTANTS.CANCEL) return null;
  return (err && err.response && err.response.data && err.response.data.message)
    ? err.response.data.message
    : TOAST_MESSAGE.ERROR[method];
}

export function renderMessageError(err, method) {
  if (err && err.message === CONSTANTS.CANCEL) return null;
  const errorMethod = method || err?.response?.config?.method || CONSTANTS.DEFAULT;
  const messageString = err?.response?.data?.message || TOAST_MESSAGE.ERROR[errorMethod] || TOAST_MESSAGE.ERROR.DEFAULT;
  toast(CONSTANTS.ERROR, messageString, TOAST_MESSAGE.ERROR.DESCRIPTION);
}

export function renderMessageSignError(err) {
  if (err && err.message === CONSTANTS.CANCEL) return null;
  const messageString = TOAST_SIGN_MESSAGE.ERROR[err?.response?.status] || TOAST_SIGN_MESSAGE.ERROR.DEFAULT;
  toast(CONSTANTS.ERROR, messageString);
}

//
export function toast(type, label = '', requiredId = false) {
  if (!type) return;

  const toastifyOptions = {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  };

  if (requiredId) {
    toastifyOptions.toastId = label;
  }

  const toastMessage = <>
    {TOAST_MESSAGE.ICON[type]}
    <div
      className="float-left d-flex"
      style={{
        width: '246px',
        paddingLeft: '10px',
        minHeight: '24px',
      }}>
      <label className="my-auto">{label}</label>
    </div>
  </>;

  toastify.toast[type.toLowerCase()](toastMessage, toastifyOptions);
}

export function columnIndex(pageSize, currentPage) {
  return {
    title: t('STT'),
    align: 'center',
    render: (value, row, index) => (index + 1) + (pageSize * (currentPage - 1)),
    width: 65,
  };
}

export function difference(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
}

export function momentValid(date) {
  return date && moment(new Date(date)).isValid();
}

export function dateToISOString(date) {
  try {
    return date ? date.toISOString() : '';
  } catch (e) {
    return null;
  }
}

export function convertMoment(dateTime) {
  try {
    return momentValid(dateTime) ? moment(new Date(dateTime)) : '';
  } catch (e) {
    return null;
  }
}

export function formatDate(dateTime) {
  try {
    return momentValid(dateTime) ? moment(dateTime).format('DD/MM/YYYY') : '';
  } catch (e) {
    return null;
  }
}

export function formatDateTime(dateTime) {
  try {
    return momentValid(dateTime) ? moment(dateTime).format('DD/MM/YYYY HH:mm') : '';
  } catch (e) {
    return null;
  }
}

export function formatTimeDate(dateTime) {
  try {
    return momentValid(dateTime) ? moment(dateTime).format('HH:mm DD/MM/YYYY') : '';
  } catch (e) {
    return null;
  }
}

export function renderRowData(label, value, labelWidth = '100px') {
  return <div className="clearfix" style={{ lineHeight: '20px' }}>
    <strong style={{ fontSize: '12px', fontStyle: 'italic', width: labelWidth }} className="float-left">
      {label}:
    </strong>
    <div className="ml-3">{value}</div>
  </div>;
}

export function renderRowErrorData(label, value, labelWidth = '100px') {
  return <div className="clearfix" style={{ lineHeight: '20px' }}>
    <strong style={{ fontSize: '12px', fontStyle: 'italic', width: labelWidth, color: value ? '' : 'red' }}
            className="float-left">
      {label}:
    </strong>
    <div className="ml-3">{value}</div>
  </div>;
}

export function renderCard(label, value, className, disabled) {
  return <div className={className} style={{ borderRadius: 5, color: 'white' }} disabled={disabled}>
    <strong style={{ fontSize: '50px', textAlign: 'center' }}>{value}</strong>
    <span style={{ fontSize: disabled ? '22px' : '20px', textAlign: 'center' }}> {t('PHIEU')}</span>
    <br/>
    <span style={{ fontSize: disabled ? '22px' : '20px', textAlign: 'center' }}>
      {label}
    </span>
  </div>;
}

export function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatQueryOneDay(time) {
  const gte = moment(time).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const lt = moment(gte).add({ days: 1 });
  return { gte: gte.toISOString(), lt: lt.toISOString() };
}

export function convertArrayObjToCamelCase(objInput) {
  objInput = JSON.parse(JSON.stringify(objInput));
  return objInput.map(obj => {
    return convertObjToCamelCase(obj);
  });
}

export function convertObjToCamelCase(objInput) {
  if (!objInput) return;
  objInput = JSON.parse(JSON.stringify(objInput));
  const objOutput = {};
  Object.entries(objInput).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value = value.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (Array.isArray(item)) {
          return convertArrayObjToCamelCase(item);
        } else {
          return convertObjToCamelCase(item);
        }
      });
    } else if (typeof value === 'object') {
      value = convertObjToCamelCase(value);
    }
    if (key === '_id') {
      objOutput._id = value;
      objOutput.key = value;
    } else {
      objOutput[camelCase(key)] = value;
    }
  });
  return objOutput;
}

export function convertObjToSnakeCase(objInput) {
  if (!objInput) return;
  objInput = JSON.parse(JSON.stringify(objInput));
  const objOutput = {};
  Object.entries(objInput).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value = value.map(item => {
        if (typeof item === 'string') {
          return item;
        } else {
          return convertObjToSnakeCase(item);
        }
      });
    } else if (typeof value === 'object') {
      value = convertObjToSnakeCase(value);
    }
    if (key === '_id') {
      objOutput._id = value;
      objOutput.key = value;
    } else {
      objOutput[snakeCase(key)] = value;
    }
  });
  return objOutput;


  // if (!objInput) return;
  // objInput = JSON.parse(JSON.stringify(objInput));
  // const objOutput = {};
  // Object.entries(objInput).forEach(([key, value]) => {
  //   if (key === '_id') {
  //     objOutput._id = value;
  //   } else {
  //     objOutput[snakeCase(key)] = value;
  //   }
  // });
  // return objOutput;
}


export function paginationConfig(onChange, state, paginationConfig = PAGINATION_CONFIG) {
  const pagination = Object.assign({}, paginationConfig);
  if (onChange) {
    pagination.onChange = onChange;
  }
  if (state) {
    pagination.current = state.currentPage;
    pagination.total = state.totalDocs;
    pagination.pageSize = state.pageSize;
  }
  return pagination;
}

export function cloneDevice(device = {}, options = {}) {
  const deviceReturn = cloneObj(device);
  deviceReturn.key = deviceReturn.key || deviceReturn._id;
  deviceReturn.isLoading = false;
  deviceReturn.isEditing = false;
  deviceReturn.isDeleted = false;
  deviceReturn.help = {};
  return Object.assign({}, deviceReturn, options);
}

//--------------------------------------------------------------------
export function convertSnakeCaseToCamelCase(dataInput) {
  if (typeof dataInput === 'object') {
    if (Array.isArray(dataInput)) {
      let objOutput = [];
      dataInput.forEach(item => {
        objOutput = [...objOutput, convertSnakeCaseToCamelCase(item)];
      });
      return objOutput;
    } else {
      return convertObjectToCamelCase(dataInput);
    }
  }
  return dataInput;
}

export function convertObjectToCamelCase(objInput) {
  if (!objInput) return objInput;
  const objOutput = {};
  Object.entries(objInput).forEach(([key, value]) => {
    if (key === 'extra') {
      objOutput[key] = value;
    } else {
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          // array
          objOutput[camelCase(key)] = convertSnakeCaseToCamelCase(value);
        } else {
          // object
          objOutput[camelCase(key)] = convertObjectToCamelCase(value);
        }
      } else {
        if (key === '_id') {
          objOutput._id = value;
          objOutput.key = value;
        } else {
          objOutput[camelCase(key)] = value;
        }
      }
    }
  });
  return objOutput;
}

//--------------------------------------------------------------------
export function convertCamelCaseToSnakeCase(dataInput) {
  dataInput = cloneObj(dataInput);
  if (typeof dataInput === 'object') {
    if (Array.isArray(dataInput)) {
      let objOutput = [];
      dataInput.forEach(item => {
        objOutput = [...objOutput, convertCamelCaseToSnakeCase(item)];
      });
      return objOutput;
    } else {
      return convertObjectToSnakeCase(dataInput);
    }
  }
  return dataInput;
}

export function convertObjectToSnakeCase(objInput) {
  if (!objInput) return objInput;
  objInput = cloneObj(objInput);
  const objOutput = {};
  Object.entries(objInput).forEach(([key, value]) => {
    if (key === 'extra' || key.charAt(0) === '_') {
      objOutput[key] = value;
    } else {
      if (typeof value === 'object') {
        if (moment.isMoment(value)) {
          objOutput[snakeCase(key)] = value;
        } else if (Array.isArray(value)) {
          // array
          objOutput[snakeCase(key)] = convertCamelCaseToSnakeCase(value);
        } else {
          // object
          objOutput[snakeCase(key)] = convertObjectToSnakeCase(value);
        }
      } else {
        if (key === '_id') {
          objOutput._id = value;
        } else {
          objOutput[snakeCase(key)] = value !== undefined ? value : null;
        }
      }
    }
  });
  return objOutput;
}

//--------------------------------------------------------------------
export function genPolygonFromRectangle({ x, y, width, height, polygons, ...props }) {
  if (Array.isArray(polygons) && polygons.length) return polygons;

  return [
    { offsetX: x, offsetY: y },
    { offsetX: x + width, offsetY: y },
    { offsetX: x + width, offsetY: y + height },
    { offsetX: x, offsetY: y + height },
  ];
}

export function checkPointInsideObject(point, polygon) {
  let x = point.offsetX, y = point.offsetY;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].offsetX, yi = polygon[i].offsetY;
    let xj = polygon[j].offsetX, yj = polygon[j].offsetY;
    let intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function convertObjectToArray(objectInput) {
  let arrayOutput = [];

  if (typeof objectInput === 'object' && !Array.isArray(objectInput)) {
    Object.entries(objectInput).forEach(([key, value]) => {
      arrayOutput = [...arrayOutput, value];
    });
  }
  return arrayOutput;
}

export function formatUnique(arr) {
  return Array.from(new Set(arr)); //
}

export function calPageNumberAfterDelete({ docs, currentPage }) {
  if (!Array.isArray(docs) || !currentPage || currentPage === 1) return 1;
  return docs.length === 1 ? currentPage - 1 : currentPage;
}

export function renderTreeNode(children) {
  if (!Array.isArray(children)) return null;
  return children.map(child => {
    return <TreeSelect.TreeNode
      key={child.key}
      value={child._id}
      title={child?.name|| child?.tenDuongDay}
      selectable={child?.selectable}
    >
      {renderTreeNode(child.children)}
    </TreeSelect.TreeNode>;
  });
}

// export function renderFilterTreeUnit(orgUnitTree, defaultValue) {
//   if (!Array.isArray(orgUnitTree) || !orgUnitTree) return;

//   return <TreeSelect
//     size="small" showSearch
//     style={{ width: '100%' }}
//     className="select-label"
//     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//     placeholder={t('TAT_CA_DON_VI')}
//     treeDefaultExpandAll
//     allowClear
//     filterOption={(input, option) => removeAccents(option.title?.toLowerCase()).includes(removeAccents(input.toLowerCase()))}
//     {...defaultValue ? { defaultValue } : null}
//   >
//     {renderTreeNode(orgUnitTree)}
//   </TreeSelect>;
// }

export function checkLoaded() {
  return document.readyState === 'complete';
}

export function formatFormDataExtra(dataInput = {}, modelExtraData = []) {
  const dataOutput = cloneObj(dataInput);
  if (dataOutput.extra) {
    Object.entries(dataOutput.extra).forEach(([key, value]) => {
      const fieldType = modelExtraData.find(extra => extra.fieldKey === key)?.fieldType;
      switch (fieldType) {
        case KIEU_DU_LIEU.VAN_BAN.code:
          dataOutput[`extra-${key}`] = value;
          break;
        case KIEU_DU_LIEU.THOI_GIAN.code:
          dataOutput[`extra-${key}`] = convertMoment(value);
          break;
        case KIEU_DU_LIEU.DANH_SACH.code:
          dataOutput[`extra-${key}`] = value?._id || value;
          break;
        default:
          break;
      }
    });
    delete dataOutput.extra;
  }
  return dataOutput;
}

export function formatQueryDataExtra(dataInput) {
  const dataOutput = { ...dataInput };
  Object.entries(dataOutput).forEach(([key, value]) => {
    if (key.includes('extra-')) {
      const extraFieldKey = key.substring(key.indexOf('-') + 1);
      if (dataOutput.hasOwnProperty('extra')) {
        dataOutput.extra[extraFieldKey] = value;
      } else {
        dataOutput.extra = { [extraFieldKey]: value };
      }
      delete dataOutput[key];
    }
  });
  return dataOutput;
}

export function formatTypeSkeletonExtraData(extra) {
  let type = null, options = null;
  switch (extra.fieldType) {
    case KIEU_DU_LIEU.VAN_BAN.code:
      type = CONSTANTS.TEXT;
      break;
    case KIEU_DU_LIEU.THOI_GIAN.code:
      type = CONSTANTS.DATE;
      break;
    case KIEU_DU_LIEU.DANH_SACH.code:
      type = CONSTANTS.SELECT;
      options = { data: extra.fieldOptions };
      break;
    default:
      break;
  }
  return { type, options };
}

export function renderTreeNoiDungKiemTra(children) {
  if (!Array.isArray(children)) return null;
  return children.map(child => {
    return <TreeSelect.TreeNode
      key={child.key}
      title={child?.tenNoiDung}
      selectable={false}
    >
      {renderTreeTieuChi(child?.tieuChiId)}
    </TreeSelect.TreeNode>;
  });
}

export function renderTreeTieuChi(children) {
  if (!Array.isArray(children)) return null;
  return children.map(child => {
    return <TreeSelect.TreeNode
      key={child.key}
      value={child._id}
      title={child?.tenTieuChi}
    >
      {renderTreeTieuChi(child.chiTiet)}
    </TreeSelect.TreeNode>;
  });
}

export function renderFilterTreeTieuChi(TieuChi, defaultValue) {
  if (!Array.isArray(TieuChi) || !TieuChi) return;

  return <TreeSelect
    size="small" showSearch
    style={{ width: '100%' }}
    className="select-label"
    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    placeholder={t('TAT_CA_TON_TAI')}
    allowClear
    {...defaultValue ? { defaultValue } : null}
  >
    {renderTreeNoiDungKiemTra(TieuChi)}
  </TreeSelect>;
}


export function checkIsValidDate(date) {
  return moment(new Date(parseInt(date))).isValid() ? moment(new Date(parseInt(date))) : '';
}

export function getTimestamp(date) {
  return date ? new Date(new Date(date).setHours(0, 0, 0, 0)).getTime() : '';
}

export function getExacltyTimestamp(date) {
  return date ? new Date(new Date(date)).getTime() : '';
}


export function downloadFile(linkTo, label, title = t('TAI_XUONG_TAP_TIN')) {
  return <Tooltip title={title} placement="topRight">
    <Link to={linkTo} target="_blank"
          download style={{ alignSelf: 'center', color: 'geekblue' }}
          className="tab-btn tab-btn-sm"><i className="fas fa-file-download"/> {label}</Link>
  </Tooltip>;
}

export function downloadDocx(linkTo, loading = false) {
  return <Tooltip title={t('TAI_XUONG_TAP_TIN')} placement="topRight">
    <Link to={linkTo} target="_blank"
          download style={{ alignSelf: 'center', color: 'geekblue' }}
          className="font-italic">
      <Tag color="#108ee9" icon={<i className="far fa-file-word"/>} disabled={loading}> .docx</Tag>
    </Link>
  </Tooltip>;
}

export function downloadExcel(linkTo, label = '') {
  return <Tooltip title={t('TAI_XUONG_TAP_TIN')} placement="topRight">
    <Link to={linkTo} target="_blank"
          download style={{ alignSelf: 'center', color: 'geekblue' }}
          className="font-italic">
      <Tag color="#87d068" icon={<i className="far fa-file-excel"/>}> {`${label}.xlsx`}</Tag>
    </Link>
  </Tooltip>;
}

export function downloadPdf(functionDownload, assignId, soPhieu, type = '', loading = false) {
  const [loadingDownload, setLoadingDownload] = useState(false);
  return <Tooltip title={t('TAI_XUONG_TAP_TIN')} placement="topRight">
    <Tag color="#cd201f" icon={<i className="far fa-file-pdf"/>} disabled={loading || loadingDownload}
         onClick={async () => {
           await setLoadingDownload(true);
           await functionDownload(assignId, soPhieu);
           await setLoadingDownload(false);
         }}
    > .pdf
      {loadingDownload ? <LoadingOutlined/> : null}
    </Tag>
  </Tooltip>;
}

// export function downloadPdf(linkTo, title = t('TAI_XUONG_TAP_TIN')) {
//   return <Tooltip title={title} placement="topRight">
//     <Link to={linkTo} target="_blank"
//           download style={{ alignSelf: 'center', color: 'geekblue' }}
//           className="font-italic">
//       <Tag color="#cd201f" icon={<i className="far fa-file-pdf"/>}> .pdf</Tag>
//     </Link>
//   </Tooltip>;
// }

export function downloadFileBtn(linkTo, color = '', label, icon = null, title = t('TAI_XUONG_TAP_TIN')) {
  return <Tooltip title={title} placement="topRight">
    <Link to={linkTo} target="_blank"
          download style={{ alignSelf: 'center', color: 'geekblue' }}
          className="font-italic">
      <Tag color={color} icon={icon}> {label}</Tag>
    </Link>
  </Tooltip>;
}

export function addMonthFromCurrent(currentDate, amountMonth) {
  return moment(currentDate).add(amountMonth, 'M');
}

export function addKeyToListData(listData = []) {
  return listData?.map((item, index) => {
    item.key = index + 1;
    return item;
  });
}

///Canvas
export function formatCanvasData(dataInput) {
  if (!Array.isArray(dataInput)) return [];
  return dataInput.map((item) => formatCanvasItem(item));
}

export function formatCanvasItem(item) {
  const COLOR = {
    DEFAULT: '#00003c',
    THIET_BI: '#5cdbd3',
    BAT_THUONG: '#f5222d',
    REVERSE_BAT_THUONG: '#FFFFFF',
    ACTIVE: '#2f54eb',
    REVERSE_ACTIVE: '#FFFFFF',
    MID_POINT: 'rgba(47,84,235,0.4)',
  };

  item = cloneObj(item);
  item.type = Array.isArray(item.coordinates) && item.coordinates.length ? 'POLYGON' : 'RECTANGLE';
  item.coordinates = Array.isArray(item.coordinates) ? item.coordinates : [];
  item.position = Array.isArray(item.coordinates) && item.coordinates.length ? item.coordinates : {};
  item.position.offsetX = item.x;
  item.position.offsetY = item.y;
  item.position.width = item.width;
  item.position.height = item.height;
  item.active = false;
  item.drawing = false;
  item.display = true;
  item.disabled = !!item._id;
  item.strokeStyle = COLOR.THIET_BI;
  item.activeStrokeStyle = COLOR.ACTIVE;
  item.key = item.key || randomKey();
  item.x = item.xmin;
  item.y = item.ymin;
  item.width = item.xmax - item.xmin;
  item.height = item.ymax - item.ymin;
  return item;
}

////////////

function replaceCommaToDot(input) {
  if (!input) return input;
  const stringInput = input.toString();
  return stringInput.replace(',', '.');
}

export function getDistanceFromLatLonInKm(p1, p2) {
  p1.latitude = p1.viDo || p1.latitude || p1.lat;
  p1.longitude = p1.kinhDo || p1.longitude || p1.lng;
  p2.latitude = p2.viDo || p2.latitude || p2.lat;
  p2.longitude = p2.kinhDo || p2.longitude || p2.lng;

  const point1 = {
    latitude: replaceCommaToDot(p1.latitude),
    longitude: replaceCommaToDot(p1.longitude),
  };

  const point2 = {
    latitude: replaceCommaToDot(p2.latitude),
    longitude: replaceCommaToDot(p2.longitude),
  };

  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(point2.latitude - point1.latitude); // deg2rad below
  let dLon = deg2rad(point2.longitude - point1.longitude);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.latitude)) * Math.cos(deg2rad(point2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c * 1000; // Distance in m
  return parseFloat(d.toFixed(3));
}

export function formatDisplayFloatNumber(number) {
  return isNaN(number) ? 0.0 : number.toFixed(1);
}

export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function secondsToHms(d) {
  d = Number(d);
  let h = ~~(d / 3600);
  let m = ~~(d % 3600 / 60);
  let s = ~~(d % 3600 % 60);

  let hDisplay = h > 0 ? h + ' giờ ' : '';
  let mDisplay = m > 0 ? m + ' phút ' : '';
  let sDisplay = s > 0 ? s + ' giây' : '';
  return hDisplay + mDisplay + sDisplay;
}

export const getFileExtension = (filename) => {
  let ext = /^.+\.([^.]+)$/.exec(filename);
  return ext === null ? '' : ext[1];
};

export function removeAccents(str) {
  const AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ', 'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ];

  for (let i = 0; i < AccentsMap.length; i++) {
    const re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    const char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

export function validURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

export function renderURL(urlString) {
  if (!urlString?.startsWith('https://') && !urlString?.startsWith('http://')) {
    return `https://${urlString}`;
  }
  return urlString;
}

export function calculateArea(a, b, c) {
  const Ax = parseFloat(a.viDo || a.lat);
  const Ay = parseFloat(a.kinhDo || a.lng);
  const Bx = parseFloat(b.viDo || b.lat);
  const By = parseFloat(b.kinhDo || b.lng);
  const Cx = parseFloat(c.viDo || c.lat);
  const Cy = parseFloat(c.kinhDo || c.lng);
  return Math.abs(Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By)) / 2;
}

export function checkIsMobileOrTablet() {
  let check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

export async function addKeyForTree(treeData) {
  if (treeData.children && !!treeData.children.length) {
    await treeData.children.forEach((node) => addKeyForTree(node));
  }
  treeData.key = treeData._id;
}
