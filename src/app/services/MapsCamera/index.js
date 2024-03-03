import { API } from '@api';
import axios from 'axios';
import { convertParam } from '@app/common/functionCommons';
import { renderMessageError } from '@app/common/functionCommons';

export function getAllMarkerMapsCamera(query) {
  const params = convertParam(query, '&');
  return axios.get(`${API.MARKER_MAPS_CAMERA}?${params}` )
    .then(response => {
      if (response.status === 200) return response.data?.data;
      return null;
    })
    .catch((err) => {
      renderMessageError(err);
      return null;
    });
}

