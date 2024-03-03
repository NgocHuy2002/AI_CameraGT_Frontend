import axios from 'axios';
import { API } from '@api';
import { renderMessageError } from '@app/common/functionCommons';

export function getRefreshToken(data) {
  return axios.post(`${API.REFRESH_TOKEN}`, data)
    .then(response => {
      if (response.status === 200) {
        if (response.status === 200) return response.data;
        return null;
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

export function deleteRefreshToken(data) {
  return axios.delete(`${API.REFRESH_TOKEN_QUERY.format(data)}`)
    .then(response => {
      if (response.status === 200) {
        if (response.status === 200) return response.data;
        return null;
      }
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}
