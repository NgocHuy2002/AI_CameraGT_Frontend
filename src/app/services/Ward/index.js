import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase, getByIdBase } from '@app/services/Base';

export function createWard(data) {
  return createBase(API.WARD, data);
}

export function getAllWard(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.WARD, currentPage, totalDocs, query);
}

export function getWardById(unitId) {
  return getByIdBase(API.WARD_ID, unitId);
}

export function updateWardById(_id, data) {
  return updateBase(API.WARD_ID.format(_id), data);
}

export function deleteWard(id) {
  return deleteByIdBase(API.WARD_ID, id);
}
