import { API } from '@api';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase } from '@app/services/Base';

export function createFrame(data) {
  return createBase(API.FRAME, data);
}

export function getAllFrame(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.FRAME, currentPage, totalDocs, query);
}

export function updateFrame(data) {
  return updateBase(API.FRAME_ID, data);
}

export function deleteFrame(id) {
  return deleteByIdBase(API.FRAME_ID, id);
}
