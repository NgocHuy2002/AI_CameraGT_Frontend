import axios from 'axios';
import { API } from '@api';
import { convertArrayObjToCamelCase, convertParam, renderMessageError } from '@app/common/functionCommons';
import {
  createBase,
  deleteByIdBase,
  getAllBase,
  getAllPaginationBase,
  updateBase,
  getByIdBase,
} from '@app/services/Base';

export function createUnit(data) {
  return createBase(API.ORG_UNIT, data);
}

// export function getAllUnit(currentPage = 1, totalDocs = 0, query) {
//   return getAllBase(API.ORG_UNIT, currentPage, totalDocs, query);
// }

export function getAllUnit(query) {
  return getAllBase(API.ORG_UNIT, query);
}

export function getAllDonViCapCongTy(query) {
  return getAllBase(`${API.ORG_UNIT}/capcongty`, query);
}

export function getOrgUnitById(unitId) {
  return getByIdBase(API.ORG_UNIT_ID, unitId);
}

export function updateUnit(data) {
  return updateBase(API.ORG_UNIT_ID, data);
}

export function deleteUnit(id) {
  return deleteByIdBase(API.ORG_UNIT_ID, id);
}

export function getOrgUnitTree() {
  const params = convertParam({ tree: 'true' });
  return axios.get(`${API.ORG_UNIT}${params}`)
    .then(response => {
      if (response.status === 200 && Array.isArray(response?.data?.data)) return convertArrayObjToCamelCase(response.data.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getAllUnitTree() {
  const params = convertParam({ tree: 'true', showAll: 'true' });
  return axios.get(`${API.ORG_UNIT}${params}`)
    .then(response => {
      if (response.status === 200 && Array.isArray(response?.data?.data)) return convertArrayObjToCamelCase(response.data.data);
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function getDonViNgoai(loading) {
  return getAllBase(API.DON_VI_NGOAI, {}, loading);
}
