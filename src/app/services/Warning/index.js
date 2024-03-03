import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase, getByIdBase } from '@app/services/Base';

export function createWarning(data) {
  return createBase(API.WARNING, data);
}

export function getAllWarning(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.WARNING, currentPage, totalDocs, query);
}

export function getWarningById(unitId) {
  return getByIdBase(API.WARNING_ID, unitId);
}

export function updateWarningById(_id, data) {
  return updateBase(API.WARNING_ID.format(_id), data);
}

export function deleteWarning(id) {
  return deleteByIdBase(API.WARNING_ID, id);
}
