import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase } from '@app/services/Base';

export function createUnit(data) {
  return createBase(API.UNIT, data);
}

export function getAllUnit(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.UNIT, currentPage, totalDocs, query);
}

export function updateUnitById(_id, data) {
  return updateBase(API.UNIT_ID.format(_id), data);
}

export function deleteUnit(id) {
  return deleteByIdBase(API.UNIT_ID, id);
}
