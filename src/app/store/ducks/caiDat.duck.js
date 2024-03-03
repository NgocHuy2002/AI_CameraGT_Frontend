import { put, takeLatest } from 'redux-saga/effects';
import { getAllSetting } from '@app/services/Setting';

export const actionTypes = {
  GetCaiDatHeThong: 'CaiDat/GetCaiDatHeThong',
  SetCaiDatHeThong: 'CaiDat/SetCaiDatHeThong',
  GetConfigKiemTraDinhKy: 'CaiDat/GetConfigKiemTraDinhKy',
  SetConfigKiemTraDinhKy: 'CaiDat/SetConfigKiemTraDinhKy',
  UpdateConfigKiemTraDinhKy: 'CaiDat/UpdateConfigKiemTraDinhKy',
};

const initialAuthState = {
  caiDatHeThong: null,
  configKiemTraDinhKy: null,
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetConfigKiemTraDinhKy: {
      const { configKiemTraDinhKy } = action.payload;
      return Object.assign({}, state, { configKiemTraDinhKy });
    }
    case actionTypes.SetCaiDatHeThong: {
      const { caiDatHeThong } = action.payload;
      return Object.assign({}, state, { caiDatHeThong });
    }
    default:
      return state;
  }
};

export const actions = {
  getConfigKiemTraDinhKy: () => ({ type: actionTypes.GetConfigKiemTraDinhKy }),
  setConfigKiemTraDinhKy: configKiemTraDinhKy => ({
    type: actionTypes.SetConfigKiemTraDinhKy,
    payload: { configKiemTraDinhKy },
  }),
  getCaiDatHeThong: () => ({ type: actionTypes.GetCaiDatHeThong }),
  setCaiDatHeThong: caiDatHeThong => ({ type: actionTypes.SetCaiDatHeThong, payload: { caiDatHeThong } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetCaiDatHeThong, function* getCaiDatHeThongSaga() {
    const dataResponse = yield getAllSetting();
    if (dataResponse) {
      yield put(actions.setCaiDatHeThong(dataResponse));
    }
  });
}
