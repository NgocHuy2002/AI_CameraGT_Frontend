import { API } from '@api';
import { getAllPaginationBase, getByIdBase, updateBase } from '@app/services/Base';
import axios from 'axios';
import { convertSnakeCaseToCamelCase, convertCamelCaseToSnakeCase, renderMessageError } from '@app/common/functionCommons';

export function getAllSetting() {
  return axios.get(API.SETTING)
    .then(response => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function updateSetting(data) {
  return axios.put(API.SETTING, convertCamelCaseToSnakeCase(data))
    .then(response => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

// export function updateLinkAndroid(data) {
//   return axios.put(API.SETTING_LINK_ANDROID_APP, convertCamelCaseToSnakeCase(data))
//     .then(response => {
//       if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
//       return null;
//     })
//     .catch((err) => {
//       renderMessageError(err);
//       return null;
//     });
// }


// export function uploadFileAndroidApp(file, config = {}) {
//   config.headers = { 'content-type': 'multipart/form-data' };
//   config.loading = false;
//   const formData = new FormData();
//   formData.append('file', file);
//   return axios.put(API.SETTING_ANDROID_APP, formData, config)
//     .then(response => {
//       if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data.data);
//       return null;
//     })
//     .catch(err => {
//       renderMessageError(err);
//       return null;
//     });
// }

// export function uploadFileIosApp(file, config = {}) {
//   config.headers = { 'content-type': 'multipart/form-data' };
//   config.loading = false;
//   const formData = new FormData();
//   formData.append('file', file);
//   return axios.put(API.SETTING_IOS_APP, formData, config)
//     .then(response => {
//       if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data.data);
//       return null;
//     })
//     .catch(err => {
//       renderMessageError(err);
//       return null;
//     });
// }

export function uploadFileModelAI(domain, file, config = {}) {
  config.headers = { 
    'content-type': 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods' : 'OPTIONS, DELETE, POST, GET, PATCH, PUT',
    'Access-Control-Allow-Headers': 'X-Token, Content-Type',
    'Access-Control-Max-Age': '3600',
    'Access-Control-Allow-Credentials': 'true',
  };
  config.loading = false;
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(domain + '/download_model', formData, config)
    .then(response => {
      if (response.status === 200) return {
        message: 'Thành công'
      };
      return null;
    })
    .catch(err => {
      renderMessageError(err);
      return null;
    });
}

export function createNotification(data) {
  return axios.post(API.SETTING, data)
    .then(response => {
      if (response.status === 200) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
