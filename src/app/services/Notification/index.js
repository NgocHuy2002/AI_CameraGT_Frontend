import { API } from '@api';
import axios from 'axios';
import { renderMessageError } from '@app/common/functionCommons';

import { createBase, deleteByIdBase, getAllPaginationBase, updateBase } from '@app/services/Base';

export function createNotification(data) {
  return createBase(API.NOTIFICATION, data);
}

export function getAllNotification(currentPage = 1, totalDocs = 0, query) {
  return getAllPaginationBase(API.NOTIFICATION, currentPage, totalDocs, query, false);
}

export function updateNotification(data) {
  return updateBase(`${API.NOTIFICATION_ID}${data.id}`, data);
}

export function deleteNotification(id) {
  return deleteByIdBase(API.NOTIFICATION_ID, id);
}

export function getNotificationByType(query) {
  return axios.get(API.NOTIFICATION + query)
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
