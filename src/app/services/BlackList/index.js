import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase, getByIdBase } from '@app/services/Base';

export function createBlackList(data) {
  return createBase(API.LICENSE_PLATES_BLACK_LIST, data);
}

export function getAllBlackList(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.LICENSE_PLATES_BLACK_LIST, currentPage, totalDocs, query);
}

// export function getVehicleById(unitId) {
//   return getByIdBase(API.VEHICLE, unitId);
// }

// export function updateVehicleById(_id, data) {
//   return updateBase(API.VEHICLE.format(_id), data);
// }

export function deleteBlackList(licensePlates) {
  return deleteByIdBase(API.LICENSE_PLATES_BLACK_LIST_ID, licensePlates);
}

export function updateBlackList(licensePlates, data) {
  return updateBase(API.LICENSE_PLATES_BLACK_LIST_ID.format(licensePlates), data);
}
