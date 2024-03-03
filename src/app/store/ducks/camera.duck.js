import { put, takeLatest } from 'redux-saga/effects';
import { getAllCamera } from '@app/services/Camera';

export const actionTypes = {
  GetAllCamera: 'CaiDat/GetAllCamera',
  SetCamera: 'CaiDat/SetCamera',
};

const initialAuthState = {
  cameraList: null,
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetCamera: {
      const { cameraList } = action.payload;
      return Object.assign({}, state, { cameraList });
    }
    default:
      return state;
  }
};

export const actions = {
  getAllCamera: () => ({ type: actionTypes.GetAllCamera }),
  setCamera: cameraList => ({
    type: actionTypes.SetCamera,
    payload: { cameraList },
  }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetAllCamera, function* getAllCameraSaga() {
    const dataResponse = yield getAllCamera(1,0, {});
    if (dataResponse) {
      yield put(actions.setCamera(dataResponse));
    }
  });
}
