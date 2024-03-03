import { API } from '@api';
import {
  createBase,
  deleteByIdBase,
  getAllBase,
  getAllPaginationBase,
  getByIdBase,
  updateBase,
} from '@app/services/Base';
import axios from 'axios';
import {
  convertCamelCaseToSnakeCase,
  convertObjToCamelCase,
  convertObjToSnakeCase,
  convertParam, convertSnakeCaseToCamelCase,
  renderMessageError, renderMessageSignError,
} from '@app/common/functionCommons';
import fileDownload from 'js-file-download';

export function getBlackListPercent(query, loading = true) {
  const config = { loading };
  const params = convertParam(query);
  return axios.get(`${API.DASHBOARD_BLACKLIST}${params}`, config)
    .then(response => {
      if (response.data.data) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getVehicleQuality(query, loading = true) {
  const config = { loading };
  const params = convertParam(query);
  return axios.get(`${API.DASHBOARD_VEHICLE_QUALITY}${params}`, config)
    .then(response => {
      if (response.data.data) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getVehiclePercent(query, loading = true) {
  const config = { loading };
  const params = convertParam(query);
  return axios.get(`${API.DASHBOARD_VEHICLE_PERCENT}${params}`, config)
    .then(response => {
      if (response.data.data) return convertSnakeCaseToCamelCase(response?.data?.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
