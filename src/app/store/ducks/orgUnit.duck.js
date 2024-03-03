import { put, takeLatest } from 'redux-saga/effects';

import { getAllUnit, getDonViNgoai, getOrgUnitTree } from '@app/services/OrgUnit';

export const actionTypes = {
  GetOrgUnit: 'OrgUnit/GetOrgUnit',
  SetOrgUnit: 'OrgUnit/SetOrgUnit',
  GetOrgUnitTree: 'OrgUnit/GetOrgUnitTree',
  SetOrgUnitTree: 'OrgUnit/SetOrgUnitTree',
  GetDonViNgoai: 'OrgUnit/GetDonViNgoai',
  SetDonViNgoai: 'OrgUnit/SetDonViNgoai',
};

const initialAuthState = {
  orgUnitList: [],
  orgUnitTree: [],
  donViNgoaiTree: [],
};

export const reducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case actionTypes.SetOrgUnit: {
      const { orgUnitList } = action.payload;
      return Object.assign({}, state, { orgUnitList });
    }
    case actionTypes.SetOrgUnitTree: {
      const { orgUnitTree } = action.payload;
      return Object.assign({}, state, { orgUnitTree });
    }
    case actionTypes.SetDonViNgoai: {
      const { donViNgoaiTree } = action.payload;
      return Object.assign({}, state, { donViNgoaiTree });
    }
    default:
      return state;
  }
};

export const actions = {
  getOrgUnit: () => ({ type: actionTypes.GetOrgUnit }),
  setOrgUnit: orgUnitList => ({ type: actionTypes.SetOrgUnit, payload: { orgUnitList } }),
  getOrgUnitTree: () => ({ type: actionTypes.GetOrgUnitTree }),
  setOrgUnitTree: orgUnitTree => ({ type: actionTypes.SetOrgUnitTree, payload: { orgUnitTree } }),
  getDonViNgoai: () => ({ type: actionTypes.GetDonViNgoai }),
  setDonViNgoai: donViNgoaiTree => ({ type: actionTypes.SetDonViNgoai, payload: { donViNgoaiTree } }),
};

export function* saga() {
  yield takeLatest(actionTypes.GetOrgUnit, function* getOrgUnitSaga() {
    const dataResponse = yield getAllUnit();
    if (dataResponse) {
      yield put(actions.setOrgUnit(dataResponse));
    }
  });

  yield takeLatest(actionTypes.GetOrgUnitTree, function* getOrgUnitSaga() {
    const dataResponse = yield getOrgUnitTree();
    if (dataResponse) {
      yield put(actions.setOrgUnitTree(dataResponse));
    }
  });

  yield takeLatest(actionTypes.GetDonViNgoai, function* getDonViNgoaiSaga() {
    const dataResponse = yield getDonViNgoai();
    if (dataResponse) {
      yield put(actions.setDonViNgoai(dataResponse));
    }
  });
}
