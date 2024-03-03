import * as app from './app.duck';
import * as user from './user.duck';
import * as orgUnit from './orgUnit.duck';
import * as caiDat from '@app/store/ducks/caiDat.duck';
import * as role from '@app/store/ducks/role.duck';
import * as setting from '@app/store/ducks/setting.duck';
import * as notification from '@app/store/ducks/notification.duck';
import * as rerender from '@app/store/ducks/rerender.duck';
import * as module from '@app/store/ducks/module.duck';
import * as locale from '@app/store/ducks/locale.duck';
import * as unit from '@app/store/ducks/unit.duck';
import * as position from '@app/store/ducks/position.duck';
import * as camera from '@app/store/ducks/camera.duck';

export const DUCKS = {
  app,
  user,
  orgUnit,
  setting,
  caiDat,
  role,
  notification,
  rerender,
  module,
  locale,
  unit,
  position,
  camera,
};
