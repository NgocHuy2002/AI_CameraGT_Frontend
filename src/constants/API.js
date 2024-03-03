export const API = {
  LOGIN: '/api/users/login',
  USERS: '/api/users',
  USERS_INCLUCED_DELETED_UNIT: '/api/users/listall',
  USER_DA_XOA: '/api/users/daxoa',
  USER_DA_XOA_ID: '/api/users/daxoa/{0}',
  USER_ID: '/api/users/{0}',
  MY_INFO: '/api/users/me',
  UPDATE_MY_INFO: '/api/users/info',

  DASHBOARD: '/api/dashboard',
  DASHBOARD_BLACKLIST: '/api/dashboard/black-percent',
  DASHBOARD_VEHICLE_PERCENT: '/api/dashboard/vehicle-percent',
  DASHBOARD_VEHICLE_QUALITY: '/api/dashboard/vehicle-quality',

  ORG_UNIT: '/api/donvi',
  ORG_UNIT_ID: '/api/donvi/{0}',

  PROVINCE: '/api/tinhthanh',
  PROVINCE_ID: '/api/tinhthanh/{0}',

  DISTRICT: '/api/quanhuyen',
  DISTRICT_ID: '/api/quanhuyen/{0}',

  WARD: '/api/phuongxa',
  WARD_ID: '/api/phuongxa/{0}',
  FILE: '/api/file',
  FILE_ID: '/api/file/{0}',
  FILE_NAME_ID: '/api/file/?id={0}&file_name={1}',
  PREVIEW_ID: '/api/file/preview/{0}',
  PREVIEW_WARNING_ID: '/api/file/previewWarningImage/{0}',

  ROLE: '/api/role',
  ROLE_ID: '/api/role/{0}',

  SETTING: '/api/caidathethong',
  SETTING_ID: '/api/caidathethong/{0}',

  CAI_DAT_AI: '/api/caidatai',
  USER_RESET_PASSWORD: '/api/users/reset-password',
  USER_CHANGE_PASSWORD: '/api/users/change-password',
  USER_FORGET_PASSWORD: '/api/users/forgot-password-mail',
  USER_REFRESH_TOKEN: '/api/users/refreshToken',
  REFRESH_TOKEN: '/api/refreshToken',
  REFRESH_TOKEN_QUERY: '/api/refreshToken?{0}',

  NOTIFICATION: '/api/notification',
  NOTIFICATION_ID: '/api/notification/{0}',

  ACCESS_HISTORY: '/api/visits',

  CAMERA: '/api/camera',
  CAMERA_ID: '/api/camera/{0}',

  CAMERA_TYPE: '/api/camera-type',
  CAMERA_TYPE_ID: '/api/camera-type/{0}',

  UNIT: '/api/unit',
  UNIT_ID: '/api/unit/{0}',

  POSITION: '/api/position',
  POSITION_ID: '/api/position/{0}',

  WARNING: '/api/warning',
  WARNING_ID: '/api/warning/{0}',
  ORG_UNIT: '/api/unit',
  ORG_UNIT_ALL: '/api/unit/all',
  ORG_UNIT_ID: '/api/unit/{0}',

  UPLOAD_MODEL_AI: '/api/download_model',

  MARKER_MAPS_CAMERA: '/api/maps-camera/marker/',

  VEHICLE_LIST: '/api/vehicle-list/',
  VEHICLE: '/api/vehicle-list/{0}',
  BLACK_LIST: '/api/vehicle-list/move-to-blacklist/{0}',
  LICENSE_PLATES_BLACK_LIST: '/api/black-list/',
  LICENSE_PLATES_BLACK_LIST_ID: '/api/black-list/{0}',
  VIEW_IMAGE: '/api/file/viewFullImage/{0}',
  VIEW_VEHICLE_IMAGE: '/api/file/viewVehicleImage/{0}',
  VIEW_LICENSE_PLATES_IMAGE: '/api/file/viewLicensePlatesImage/{0}',
  WARD: '/api/ward',
  WARD_ID: '/api/ward/{0}',
  OWNER: '/api/owner/',
  OWNER_LICENSE_PLATES: '/api/owner/{0}',
  OWNER_LICENSE_PLATES: '/api/owner/{0}',
  NAVIGATION_MAP: 'api/camera/all-navigation-map',

  POST_RTSP_LINK: '/api/rtsp/',
  GET_LIVE: '/api/file/getLive/{0}/{1}'
};