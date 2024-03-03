import axios from 'axios';

import { API } from '@api';
import {
  convertCamelCaseToSnakeCase,
  convertParam,
  convertSnakeCaseToCamelCase,
  renderMessageError,
} from '@app/common/functionCommons';
import { deleteByIdBase, getAllPaginationBase } from '@app/services/Base';
import fileDownload from 'js-file-download';

export function login(data) {
  return axios.post(`${API.LOGIN}`, convertCamelCaseToSnakeCase(data))
    .then(response => {
      // if (response.status === 200) return response.data?.token;
      if (response.status === 200) return response.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

// Thực hiện get token mới
export function getNewToken(data) {
  return axios.post(`${API.USER_REFRESH_TOKEN}`, data)
    .then(response => {
      if (response.status === 200) {
        if (response.status === 200) return response.data;
        return null;
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllUser(currentPage = 1, totalDocs = 0, query, loading) {
  return getAllPaginationBase(API.USERS, currentPage, totalDocs, query, loading);
}

export function getAllUserIncludedDeletedUnit(currentPage = 1, totalDocs = 0, query, loading) {
  return getAllPaginationBase(API.USERS_INCLUCED_DELETED_UNIT, currentPage, totalDocs, query, loading);
}

export function getAllUserForToCongTac(currentPage = 1, totalDocs = 0, query, loading) {
  return getAllPaginationBase(API.USERS_TRONG_CONG_TAC, currentPage, totalDocs, query, loading);
}

export function getUserByToken() {
  return axios.get(API.MY_INFO)
    .then(response => {
      if (response?.status === 200) return convertSnakeCaseToCamelCase(response?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateMyInfo(dataUpdate) {
  return axios.put(API.UPDATE_MY_INFO, dataUpdate)
    .then(response => {
      if (response?.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function createUser(data) {
  return axios.post(API.USERS, data)
    .then(response => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateUserById(id, dataForm) {
  return axios.put(API.USER_ID.format(id), dataForm)
    .then(response => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteUserById(id) {
  return deleteByIdBase(API.USER_ID, id);
}

export function requestResetPassword(token, data) {
  return axios
    .put(API.USER_RESET_PASSWORD, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      if (res.data) {
        return res.data;
      } else {
        renderMessageError(err);
        return null;
      }
    })
    .catch(error => {
      renderMessageError(err);
      return null;
    });
}

export function requestChangePassword(data) {
  return axios.put(API.USER_CHANGE_PASSWORD, convertCamelCaseToSnakeCase(data))
    .then(response => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function requestForgetPassword(data) {
  return axios
    .post(API.USER_FORGET_PASSWORD, data)
    .then(res => {
      if (res.data) {
        return res.data;
      } else {
        return res.data;
      }
    })
    .catch(error => {
      return error.message;
    });
}

export function getInfoHrms(query, loading, isShowError = true) {
  const config = { loading };
  const params = convertParam(query);
  return axios.get(`${API.USERS}/check-ldap${params}`, config)
    .then(response => {
      if (response.status === 200) return response?.data?.data;
      return null;
    })
    .catch((err) => {
      if (isShowError) {
        renderMessageError(err);
      }
      return null;
    });
}

export async function downloadBieuMauThongKeNguoiDung(query) {
  const params = convertParam(query);
  return axios.get(`${API.BIEU_MAU_NGUOI_DUNG}${params}`, { responseType: 'blob' })
    .then(res => {
      fileDownload(res.data, `Bảng thống kê theo dõi người dùng.xlsx`);
    });
}
