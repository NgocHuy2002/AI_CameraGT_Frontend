import axios from 'axios';
import { API } from '@api';
import { convertParam } from '@app/common/functionCommons';
import { renderMessageError } from '@app/common/functionCommons';
import { createBase, deleteByIdBase, getAllPaginationBase, updateBase, getByIdBase } from '@app/services/Base';

export function createCamera(data) {
  return createBase(API.CAMERA, data);
}

export function getAllCamera(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.CAMERA, currentPage, totalDocs, query);
}

export function updateCameraById(_id, data) {
  return updateBase(API.CAMERA_ID.format(_id), data);
}

export function deleteCamera(id) {
  return deleteByIdBase(API.CAMERA_ID, id);
}

export function getCameraById(id) {
  return getByIdBase(API.CAMERA_ID, id);
}

export function getAllNavigationMap(query) {
  const params = convertParam(query, '&');
  return axios.get(`${API.NAVIGATION_MAP}?${params}` )
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

