import { API } from '@api';

import { createBase } from '@app/services/Base';
import { get } from '../Base';

export function createRtspLive(data) {
  return createBase(API.POST_RTSP_LINK, data);
}

export function stopRtspLive() {
    return get(API.POST_RTSP_LINK);
  }

