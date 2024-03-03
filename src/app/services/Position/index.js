import axios from 'axios';
import { API } from '@api';
import fileDownload from 'js-file-download';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase } from '@app/services/Base';

export function createPosition(data) {
  return createBase(API.POSITION, data);
}

export function getAllPosition(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.POSITION, currentPage, totalDocs, query);
}

export function updatePositionById(_id, data) {
  return updateBase(API.POSITION_ID.format(_id), data);
}

export function deletePosition(id) {
  return deleteByIdBase(API.POSITION_ID, id);
}

export function insertManyPosition(data) {
  return createBase(`${API.POSITION}/insert-many`, data);
}

export function downloadTemplate() {
  const config = { responseType: 'blob', loading: false };
  return axios.get(`${API.POSITION}/download-template`, config)
    .then(res => {
      if (res.data) {
        fileDownload(res.data, `Mẫu upload vị trí.xlsx`);
      }
      return null;
    }).catch((err) => {
      console.log(err);
      return null;
    });
}