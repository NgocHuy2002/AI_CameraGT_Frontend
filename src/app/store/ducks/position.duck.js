import { put, takeLatest } from 'redux-saga/effects';
import { getAllPosition } from '@app/services/Position';

export const actionTypes = {
  GetAllPosition: 'CaiDat/GetAllPosition',
  SetPosition: 'CaiDat/SetPosition',
};

const initialAuthState = {
  positionList: null,
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetPosition: {
      const { positionList } = action.payload;
      return Object.assign({}, state, { positionList });
    }
    default:
      return state;
  }
};

export const actions = {
  getAllPosition: () => ({ type: actionTypes.GetAllPosition }),
  setPosition: positionList => ({
    type: actionTypes.SetPosition,
    payload: { positionList },
  }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetAllPosition, function* getAllPositionSaga() {
    const dataResponse = yield getAllPosition(1,0, {});
    if (dataResponse) {
      yield put(actions.setPosition(dataResponse));
    }
  });
}
