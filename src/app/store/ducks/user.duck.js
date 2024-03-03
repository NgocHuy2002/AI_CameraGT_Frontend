import { put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';

import { URL } from '@url';
import { CONSTANTS } from '@constants';

import { getUserByToken, updateMyInfo } from '@app/services/User';
import {
  checkTokenExp,
  cloneObj,
  convertMoment,
  convertSnakeCaseToCamelCase,
  formatUnique,
  toast,
} from '@app/common/functionCommons';

import resources from '@app/rbac/resources';
import { ACTIONS } from '@app/rbac/commons';
import { authorizePermission } from '@app/rbac/authorizationHelper';
import { create } from '@app/rbac/permissionHelper';
import { getAllSetting } from '@app/services/Setting';
import moment from 'moment';

export const actionTypes = {
  RequestUser: 'User/RequestUser',
  UserLoaded: 'User/UserLoaded',
  UpdateMyInfo: 'User/UpdateMyInfo',
  ClearToken: 'App/ClearToken',
  GetPermission: 'User/GetPermission',
};

const initialState = {
  permissions: {},
  myInfo: {},
  requiredChangePassword: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UserLoaded: {
      const { infoData } = action.payload;
      let { requiredChangePassword } = state;
      if (infoData.lastChangePassword) {
        const lastChangePassword = convertMoment(infoData.lastChangePassword);
        const diff = moment().diff(lastChangePassword, 'days');
        requiredChangePassword = diff > infoData.caiDatHeThong?.phienDoiMatKhau;
      }
      return { ...state, myInfo: Object.assign({}, state.myInfo, infoData), requiredChangePassword };
    }

    case actionTypes.GetPermission: {
      const { userPermissions } = state?.myInfo;
      const permissions = {};
      Object.entries(resources).forEach(([key, value]) => {
        permissions[key] = {};
        ACTIONS.forEach(actionItem => {
          permissions[key][actionItem.code] = authorizePermission(userPermissions, [create(value, actionItem)]);
        });
      });
      return Object.assign({}, state, { permissions: convertSnakeCaseToCamelCase(permissions) });
    }

    default:
      return state;
  }
};

export const actions = {
  requestUser: (history) => ({ type: actionTypes.RequestUser, payload: { history } }),
  userLoaded: infoData => ({ type: actionTypes.UserLoaded, payload: { infoData } }),
  updateMyInfo: myInfo => ({ type: actionTypes.UpdateMyInfo, payload: { myInfo } }),
  clearToken: () => ({ type: actionTypes.ClearToken, payload: { token: null } }),
  getPermission: () => ({ type: actionTypes.GetPermission }),
};

export function* saga() {
  yield takeLatest(actionTypes.RequestUser, function* requestUserSaga(data) {
    // const { history } = data?.payload;
    const token = Cookies.get('token');
    if (checkTokenExp(token)) {
      const dataResponse = yield getUserByToken();
      const caiDatHeThong = yield getAllSetting();
      if (dataResponse) {
        let userPermissions = [];
        if (Array.isArray(dataResponse.roleId)) {
          cloneObj(dataResponse.roleId).forEach(role => {
            userPermissions = [...userPermissions, ...role.permissions];
          });
        }
        if (Array.isArray(dataResponse.permissions)) {
          userPermissions = [...userPermissions, ...dataResponse.permissions];
        }
        dataResponse.userPermissions = formatUnique(userPermissions);
        if(caiDatHeThong) dataResponse.caiDatHeThong = caiDatHeThong;
        yield put(actions.userLoaded(dataResponse));
      }
    }
    // else {
    //   yield put(actions.clearToken());
    //   history.push(URL.LOGIN);
    // }
  });
  yield takeLatest(actionTypes.UpdateMyInfo, function* updateMyInfoSaga(data) {
    const dataResponse = yield updateMyInfo(data?.payload?.myInfo);
    if (dataResponse) {
      delete dataResponse.password;
      yield put(actions.userLoaded(dataResponse));
      toast(CONSTANTS.SUCCESS, 'Cập nhật thông tin thành công');
    }
  });
}
