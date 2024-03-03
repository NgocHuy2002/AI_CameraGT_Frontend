import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';

export const SIDER_WIDTH = 270;

export const COLOR = {
  DEFAULT: '#00199F',
};
import { t } from 'i18next';

export const CONSTANTS = {
  LANG_VI: 'vi',
  LANG_EN: 'en',
  FILTER_PREFIX: 'filter_',
  USER_NAME_ADDON: '1npt\\',
  IMAGE: 'IMAGE',
  DATE_REQUIRED_CHANGE_PASSWORD: 90,
  DOCX: 'DOCX',
  XLSX: 'XLSX',
  PDF: 'PDF',
  IN: 'IN',
  OUT: 'OUT',
  PREV: 'PREV',
  NEXT: 'NEXT',
  HIDDEN: 'HIDDEN',
  EXISTS: 'EXISTS',
  NOT_EXIST: 'NOT_EXIST',
  INITIAL: 'INITIAL',
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  LOGIN: 'LOGIN',
  DEFAULT: 'DEFAULT',
  ALL: 'ALL',
  READ: 'READ',
  DELETE: 'DELETE',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  SAVE: 'SAVE',
  CONFIRM: 'CONFIRM',
  CANCEL: 'CANCEL',
  CLOSE: 'CLOSE',

  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  MONTH: 'MONTH',
  QUARTER: 'QUARTER',
  YEAR: 'YEAR',
  OTHER: 'OTHER',
  DATE: 'DATE',
  TIME_OPTIONS: 'TIME_OPTIONS',
  TIME: 'TIME',
  DATE_TIME: 'DATE_TIME',
  TIME_DATE: 'TIME_DATE',
  FORMAT_DATE: 'DD/MM/YYYY',
  FORMAT_DATE_TIME: 'DD/MM/YYYY HH:mm',
  FORMAT_TIME_DATE: 'HH:mm DD/MM/YYYY',
  INPUT: 'INPUT',
  CHECK_BOX: 'CHECK_BOX',
  SELECT: 'SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  TEXT_AREA: 'TEXT_AREA',
  SELECT_MULTI: 'SELECT_MULTI',
  PASSWORD: 'PASSWORD',
  SWITCH: 'SWITCH',
  LABEL: 'LABEL',
  SELECT_LABEL: 'SELECT_LABEL',
  TREE_SELECT: 'TREE_SELECT',
  FILE: 'FILE',
  ONE_DAY: 'ONE_DAY',
  RANGER: 'RANGER',

  DESTROY: 'DESTROY',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  INFO: 'INFO',
  WARNING: 'WARNING',

  NOT_IN: 'NOT_IN',
  NOT_UPLOADED: 'NOT_UPLOADED',
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  UPLOAD_ERROR: 'UPLOAD_ERROR',

  NOT_FOUND: 'NOT_FOUND',
  RECTANGLE: 'RECTANGLE',
  POLYGON: 'POLYGON',
  POINT_SIZE: 8,

  KHONG_DAT: 'KHONG_DAT',
  DAT: 'DAT',
  PERMISSION_DEFAULT: {
    create: false,
    delete: false,
    update: false,
  },

  VI_TRI: 'VI_TRI',
  KHOANG_COT: 'KHOANG_COT',

  START: 'START',
  END: 'END',
  LOCK: 'LOCK',
  COMPLETE: 'COMPLETE',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  POPULATE: 'populate',
  DATE_TIME_FORMAT: '--:-- --/--/----',
  LOG_OUT: 'logout',
  AUTO_COMPLETE: 'AUTO_COMPLETE',
};

export const PAGINATION_INIT = Object.assign({}, {
  docs: [],
  currentPage: 1,
  pageSize: 10,
  totalDocs: 0,
  query: {},
});
export const TOKEN_EXP_TIME = 1000 * 5 * 60;

export const GENDER_OPTIONS = [
  { label: 'MALE', value: 'MALE', code: 'MALE' },
  { label: 'FEMALE', value: 'FEMALE', code: 'FEMALE' },
  { label: 'OTHER', value: 'OTHER', code: 'OTHER' },
];
export const THOI_GIAN_FILTER = [
  {
    label: 'THANG_HIEN_TAI',
    value: 'MONTH',
    code: 'THANG_HIEN_TAI',
    fromDate: moment().startOf('month'),
    toDate: moment().endOf('month'),
  },
  {
    label: 'QUY_HIEN_TAI',
    value: 'QUARTER',
    code: 'QUY_HIEN_TAI',
    fromDate: moment().startOf('quarter'),
    toDate: moment().endOf('quarter'),
  },
  {
    label: 'NAM_HIEN_TAI',
    value: 'YEAR',
    code: 'NAM_HIEN_TAI',
    fromDate: moment().startOf('year'),
    toDate: moment().endOf('year'),
  },
  { label: 'TUY_CHON', value: 'OTHER', code: 'TUY_CHON' },
];

export const FILTER_THOI_GIAN_OPTIONS = [
  {
    label: 'THANG_HIEN_TAI',
    value: CONSTANTS.MONTH,
    code: 'THANG_HIEN_TAI',
    fromDate: moment().startOf('month'),
    toDate: moment(),
  },
  {
    label: 'QUY_HIEN_TAI',
    value: CONSTANTS.QUARTER,
    code: 'QUY_HIEN_TAI',
    fromDate: moment().startOf('quarter'),
    toDate: moment(),
  },
  {
    label: 'NAM_HIEN_TAI',
    value: CONSTANTS.YEAR,
    code: 'NAM_HIEN_TAI',
    fromDate: moment().startOf('year'),
    toDate: moment(),
  },
  { label: 'TUY_CHON', value: CONSTANTS.TIME_OPTIONS, code: 'TUY_CHON' },
];

export const ERR_FILTER = [
  { label: 'Tất cả', value: 'ALL', code: 'TAT_CA' },
  { label: 'Dữ liệu không hợp lệ', value: 'ERR', code: 'ERR_DATA' },
  { label: 'Dữ liệu hợp lệ', value: 'NO_ERR', code: 'NO_ERR_DATA' },
];

export const TOAST_MESSAGE = {
  SUCCESS: {
    DEFAULT: 'Thành công',
  },
  ERROR: {
    DEFAULT: 'Có lỗi xảy ra. Vui lòng liên hệ quản trị viên',
    LOGIN: 'Có lỗi trong quá trình đăng nhập',
    GET: 'Có lỗi trong quá trình lấy dữ liệu',
    POST: 'Có lỗi trong quá trình tạo mới',
    PUT: 'Có lỗi trong quá trình cập nhật',
    DELETE: 'Có lỗi trong quá trình xoá dữ liệu',
    DESCRIPTION: 'Vui lòng kiểm tra và thử lại',
  },
  ICON: {
    SUCCESS: <CheckCircleOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
    ERROR: <CloseCircleOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
    INFO: <InfoCircleOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
    WARNING: <WarningOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
  },
};

export const TOAST_SIGN_MESSAGE = {
  SUCCESS: {
    DEFAULT: 'Thành công',
  },
  ERROR: {
    100: 'Có lỗi',
    102: 'App code không có hoặc không tồn tại',
    108: 'App code không đúng hoặc không có',
    109: 'Mật khẩu không đúng hoặc không có',
    402: 'Không thể kết nối đến server ký điện tử. Vui lòng kiểm tra đường dẫn ký điện tử!',
    403: 'Lỗi ký điện tử. Vui lòng thử lại!',
  },
  ICON: {
    SUCCESS: <CheckCircleOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
    ERROR: <CloseCircleOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
    INFO: <InfoCircleOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
    WARNING: <WarningOutlined className="float-left" style={{ fontSize: '24px', color: '#fff' }}/>,
  },
};

export function getRules(t, rules) {
  switch (rules) {
    case 'REQUIRED':
      return { required: true, message: t('MSG_RULES_REQUIRED') };
    case 'NUMBER':
      return { pattern: '^[0-9]+$', message: t('MSG_RULES_NUMBER') };
    case 'PHONE':
      return { pattern: '^[0-9]+$', len: 10, message: t('MSG_RULES_PHONE') };
    case 'FAX':
      return { pattern: '^[0-9]+$', min: 10, max: 11, message: t('MSG_RULES_FAX') };
    case 'CMND':
      return { required: true, pattern: '^[0-9]+$', message: t('MSG_RULES_CMND') };
    case 'EMAIL':
      return { type: 'email', message: t('MSG_RULES_EMAIL') };
    case 'NUMBER_FLOAT':
      return {
        pattern: new RegExp('^[- +]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$'),
        message: t('MSG_RULES_NUMBER_FLOAT'),
      };
    case 'PASSWORD_FORMAT':
      return {
        pattern: new RegExp('^(?!.* )(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\da-zA-Z])(.{8,})$'),
        message: t('MSG_RULES_PASSWORD_FORMAT'),
      };
    case 'PASSWORD_SYSADMIN_FORMAT':
      return {
        pattern: new RegExp('^(?!.* )(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\da-zA-Z])(.{16,})$'),
        message: t('MSG_RULES_PASSWORD_SYSADMIN_FORMAT'),
      };
    case 'USERNAME_RANGER':
      return {
        pattern: new RegExp('^([a-zA-Z0-9_-]){6,32}$'),
        message: t('MSG_RULES_USERNAME_RANGER'),
      };
    case 'USERNAME_LENGTH':
      return {
        pattern: new RegExp('^(?!.* )(?=.{6,32})'),
        message: t('MSG_RULES_USERNAME_LENGTH'),
      };
    case 'IP_ADDRESS_FORMAT':
      return {
        pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        message: t('MSG_RULES_IP_ADDRESS_FORMAT'),
      };
  }
}

export const RULES = {
  REQUIRED: { required: true, message: 'Không được để trống' },
  NUMBER: { pattern: '^[0-9]+$', message: 'Không phải là số' },
  PHONE: { pattern: '^[0-9]+$', len: 10, message: 'Số điện thoại không hợp lệ' },
  FAX: { pattern: '^[0-9]+$', min: 10, max: 11, message: 'Số fax không hợp lệ' },
  CMND: { required: true, pattern: '^[0-9]+$', message: 'Số CMND/CCCD không hợp lệ' },
  EMAIL: { type: 'email', message: 'Email không hợp lệ' },
  NUMBER_FLOAT: {
    pattern: new RegExp('^[- +]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$'),
    message: 'Không phải là số',
  },
  PASSWORD_FORMAT: {
    pattern: new RegExp('^(?!.* )(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\da-zA-Z])(.{8,})$'),
    message: 'Tối thiểu tám ký tự, ít nhất một ký tự hoa, một ký tự thường, một số, một ký tự đặc biệt và không được có khoảng trắng',
  },
  PASSWORD_SYSADMIN_FORMAT: {
    pattern: new RegExp('^(?!.* )(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\da-zA-Z])(.{16,})$'),
    message: 'Tối thiểu mười sáu ký tự, ít nhất một ký tự hoa, một ký tự thường, một số, một ký tự đặc biệt và không được có khoảng trắng',
  },
  USERNAME_RANGER: {
    pattern: new RegExp('^([a-zA-Z0-9_-]){6,32}$'),
    message: 'Tên tài khoản chỉ chấp nhận độ dài 6 đến 32 ký tự',
  },
  USERNAME_LENGTH: {
    pattern: new RegExp('^(?!.* )(?=.{6,32})'),
    message: 'Tên tài khoản chỉ chấp nhận độ dài 6 đến 32 ký tự và không có khoảng trắng',
  },
  IP_ADDRESS_FORMAT:{
    pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: 'Địa chỉ IP không hợp lệ',
  },
};

export const PAGINATION_CONFIG = Object.assign(
  {},
  {
    pageSizeOptions: ['5', '10', '20', '50'],
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} ${t('CUA')} ${total}`,
  },
);

export const PAGINATION_MODAL = Object.assign(
  {},
  PAGINATION_CONFIG,
  {
    pageSizeOptions: [5, 10, 15],
    defaultPageSize: 5,
  },
);

export const TRANG_THAI_HOAN_THANH = {
  DA_HOAN_THANH: 'DA_HOAN_THANH',
  CHUA_HOAN_THANH: 'CHUA_HOAN_THANH',
};


export const TRANG_THAI_HOAN_THANH_OPTIONS = [
  { code: TRANG_THAI_HOAN_THANH.DA_HOAN_THANH, label: 'Đã hoàn thành', color: '#13c2c2' },
  { code: TRANG_THAI_HOAN_THANH.CHUA_HOAN_THANH, label: 'Chưa hoàn thành', color: '#fa8c16' },
];

export const TINH_TRANG = {
  BINH_THUONG: { label: 'Bình thường', value: 'BINH_THUONG', color: '#52c41a', code: 'BINH_THUONG' },
  BAT_THUONG: { label: 'KHONG_BINH_THUONG', value: 'BAT_THUONG', color: '#fa8c16', code: 'BAT_THUONG' },
};

export const THANG_OPTIONS = [
  { label: 'Tháng 1', value: 'THANG_1', code: 'THANG_1' },
  { label: 'Tháng 2', value: 'THANG_2', code: 'THANG_2' },
  { label: 'Tháng 3', value: 'THANG_3', code: 'THANG_3' },
  { label: 'Tháng 4', value: 'THANG_4', code: 'THANG_4' },
  { label: 'Tháng 5', value: 'THANG_5', code: 'THANG_5' },
  { label: 'Tháng 6', value: 'THANG_6', code: 'THANG_6' },
  { label: 'Tháng 7', value: 'THANG_7', code: 'THANG_7' },
  { label: 'Tháng 8', value: 'THANG_8', code: 'THANG_8' },
  { label: 'Tháng 9', value: 'THANG_9', code: 'THANG_9' },
  { label: 'Tháng 10', value: 'THANG_10', code: 'THANG_10' },
  { label: 'Tháng 11', value: 'THANG_11', code: 'THANG_11' },
  { label: 'Tháng 12', value: 'THANG_12', code: 'THANG_12' },
];

function createRecord(code, name, type) {
  return { code, name, type };
}

export const TRANG_THAI_XU_LY = {
  CHUA_XU_LY: { code: 'CHUA_XU_LY', label: 'Chưa xử lý', color: '#fa541c' },
  DANG_XU_LY: { code: 'DANG_XU_LY', label: 'Đang xử lý', color: '#1890ff' },
  DA_XU_LY: { code: 'DA_XU_LY', label: 'Đã xử lý', color: '#13c2c2' },
};

export const TRANG_THAI_THUC_HIEN = {
  CHUA_THUC_HIEN: { code: 'CHUA_THUC_HIEN', label: 'Chưa thực hiện', color: '#fa541c' },
  DA_THUC_HIEN: { code: 'DA_THUC_HIEN', label: 'Đã thực hiện', color: '#13c2c2' },
};

export const KIEU_DU_LIEU = {
  VAN_BAN: { code: 'VAN_BAN', label: 'Văn bản' },
  THOI_GIAN: { code: 'THOI_GIAN', label: 'Thời gian' },
  DANH_SACH: { code: 'DANH_SACH', label: 'Danh sách' },
};

export const TRANG_THAI_XAC_NHAN = {
  CHUA_XAC_NHAN: { _id: 'CHUA_XAC_NHAN', name: 'Chưa xác nhận', color: '#b2b0b0' },
  CANH_BAO_DUNG: { _id: 'CANH_BAO_DUNG', name: 'Cảnh báo đúng', color: '#52c41a' },
  CANH_BAO_SAI: { _id: 'CANH_BAO_SAI', name: 'Cảnh báo sai', color: '#f60606' },
};

export const TRANG_THAI_KIEM_TRA = {
  DA_KIEM_TRA: { _id: 'DA_KIEM_TRA', name: 'Đã kiểm tra', color: '#52c41a' },
  CHUA_KIEM_TRA: { _id: 'CHUA_KIEM_TRA', name: 'Chưa kiểm tra', color: '#b2b0b0' },
};

export const KET_QUA_XAC_NHAN = {
  DUNG: { name: 'Đúng', value: 'DUNG', color: '#52c41a', _id: 'DUNG' },
  SAI: { name: 'Sai', value: 'SAI', color: '#fa8c16', _id: 'SAI' },
};

export const STATUS = [
  { label: 'Hoạt động', value: true, color: '#52c41a', code: true },
  { label: 'Không hoạt động', value: false, color: '#fa8c16', code: false },
];

export const DON_VI_QLVH = ['PTC1', 'PTC2', 'PTC3', 'PTC4'];

export const CONSTANTS_MODULE = {
  QUAN_LY_CAMERA_CANH_BAO: { code: 'QUAN_LY_CAMERA_CANH_BAO', label: 'Quản lý đường dây' },
};

export const COMMON_FILE_NAME_EXTENSION = ['odt', 'pdf', 'txt'];

export const OFFICE_FILE_EXTENSION = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

export const IMAGE_FILE_EXTENSION = ['jpg', 'jpeg', 'png', 'svg'];

export const APP_ANDROID_TYPE = { FILE: 'FILE', LINK: 'LINK' };

export const CONFIRM = {
  CHUA_XAC_NHAN: { code: 'CHUA_XAC_NHAN', label: 'Chưa xác nhận' },
  CANH_BAO_DUNG: { code: 'CANH_BAO_DUNG', label: 'Xác nhận cảnh báo đúng' },
  CANH_BAO_SAI: { code: 'CANH_BAO_SAI', label: 'Xác nhận cảnh báo sai' },
};

export const OBJECT = {
  SMOKE: { label: 'Khói', value: 'SMOKE' },
  FIRE: { label: 'Lửa', value: 'FIRE' },
  KITE: { label: 'Diều', value: 'KITE' },
  VEHICLE: { label: 'Phương tiện', value: 'VEHICLE' },
  TREE: { label: 'Cây cối', value: 'TREE' },
  // LIGHTNING: { label: 'Sét', value: 'LIGHTNING' },
};

export const ORG_UNIT_TYPE = {
  CAP_TINH: { level: 1, label: 'Cấp tỉnh', value: 'CAP_TINH', parentKey: null, code: 'CAP_TINH' },
  CAP_HUYEN: {
    level: 2,
    label: 'Cấp huyện',
    value: 'CAP_HUYEN',
    parentKey: 'CAP_TINH',
    code: 'CAP_HUYEN',
  },
  CAP_XA: {
    level: 3,
    label: 'Cấp xã',
    value: 'CAP_XA',
    parentKey: 'CAP_HUYEN',
    code: 'CAP_XA',
  },
};

export const VEHICLE_TYPE = {
  ALL: { label: 'Tất cả loại xe', value: 'ALL', code: 'ALL' },
  XE_MAY: { label: 'Xe máy', value: 'XE_MAY', code: 'XE_MAY' },
  O_TO: { label: 'Ô tô', value: 'O_TO', code: 'O_TO' },
  XE_TAI: { label: 'Xe tải', value: 'XE_TAI', code: 'XE_TAI' },
  XE_KHACH: { label: 'Xe khách', value: 'XE_KHACH', code: 'XE_KHACH' },
  // XE_LAM: { label: 'Xe lam', value: 'XE_LAM', code: 'XE_LAM' },
};
