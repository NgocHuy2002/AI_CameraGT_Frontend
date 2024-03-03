import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase, getByIdBase } from '@app/services/Base';

export function createNewOnwer(data) {
  return createBase(API.OWNER, data);
}

export function getAllOwner(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.OWNER, currentPage, totalDocs, query);
}

export function getOwnerByLicensePlates(licensePlates) {
  return getByIdBase(API.OWNER_LICENSE_PLATES, licensePlates);
}

export function updateOwnerByLicensePlates(licensePlates, data) {
  return updateBase(API.OWNER_LICENSE_PLATES.format(licensePlates), data);
}

export function deleteOwner(id) {
  return deleteByIdBase(API.OWNER, id);
}
