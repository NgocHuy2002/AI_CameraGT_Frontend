import { put, takeLatest } from 'redux-saga/effects';
import { getAllSetting, updateSetting} from '@app/services/Setting';

export const actionTypes = {
  GetSetting: 'App/GetSetting',
  SetSetting: 'App/SetSetting',

};

const initialAuthState = {
  settingData: [],
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetSetting: {
      const { settingData } = action.payload;
      return Object.assign({}, state, { settingData });
    }
    default:
      return state;
  }
};

export const actions = {
  getSetting: () => ({ type: actionTypes.GetSetting }),
  setSetting: settingData => ({ type: actionTypes.SetSetting, payload: { settingData } }),

};

export function* saga() {
  yield takeLatest(actionTypes.GetSetting, function* getSettingSaga(data) {
    const dataResponse = yield getAllSetting();
    if (dataResponse) {
      yield put(actions.setSetting(dataResponse));
    }
  });
}
