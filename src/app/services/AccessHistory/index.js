import { API } from '@api';
import {
  createBase,
} from '@app/services/Base';

export function createAccessHistory(data) {
    return createBase(API.ACCESS_HISTORY, data);
  }