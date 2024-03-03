import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase } from '@app/services/Base';

export function createCameraType(data) {
  return createBase(API.CAMERA_TYPE, data);
}

export function getAllCameraType(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.CAMERA_TYPE, currentPage, totalDocs, query);
}

export function updateCameraTypeById(_id, data) {
  return updateBase(API.CAMERA_TYPE_ID.format(_id), data);
}

export function deleteCameraType(id) {
  return deleteByIdBase(API.CAMERA_TYPE_ID, id);
}
