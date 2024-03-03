import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase, getByIdBase } from '@app/services/Base';

export function createVehicle(data) {
  return createBase(API.VEHICLE_LIST, data);
}

export function getAllVehicle(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.VEHICLE_LIST, currentPage, totalDocs, query);
}

export function getVehicleById(unitId) {
  return getByIdBase(API.VEHICLE, unitId);
}

export function updateVehicleById(_id, data) {
  return updateBase(API.VEHICLE.format(_id), data);
}
export function updateVehicleByLicensePlates(license_plates, data) {
  return updateBase(API.BLACK_LIST.format(license_plates), data);
}
export function deleteVehicle(id) {
  return deleteByIdBase(API.VEHICLE_LIST, id);
}
