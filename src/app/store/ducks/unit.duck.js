import { put, takeLatest } from 'redux-saga/effects';
import { getAllUnit } from '@app/services/Unit';

export const actionTypes = {
  GetAllUnit: 'CaiDat/GetAllUnit',
  SetUnit: 'CaiDat/SetUnit',
};

const initialAuthState = {
  unitList: null,
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetUnit: {
      const { unitList } = action.payload;
      return Object.assign({}, state, { unitList });
    }
    default:
      return state;
  }
};

export const actions = {
  getAllUnit: () => ({ type: actionTypes.GetAllUnit }),
  setUnit: unitList => ({
    type: actionTypes.SetUnit,
    payload: { unitList },
  }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetAllUnit, function* getAllUnitSaga() {
    const dataResponse = yield getAllUnit(1,0, {});
    if (dataResponse) {
      yield put(actions.setUnit(dataResponse));
    }
  });
}
