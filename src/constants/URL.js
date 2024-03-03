export const URL = {
  LOGIN: "/login",
  MENU: {
    DASHBOARD: "/",
    DASHBOARD_QUERY: "/{0}",
    DASHBOARD_FILTER: "?tuNgay={0}&denNgay={1}&donVi={2}",
    USER: "/nguoi-dung",
    KHOI_PHUC_TAI_KHOAN: "/khoi-phuc-tai-khoan",
    USER_MANAGEMENT: "/user-management",

    CAI_DAT_AI: "/cai-dat-ai",
    SETTING: "/cai-dat",
    DOWNLOAD_APP: "/app-mobile",

    FILE_ID: "/file/{0}",

    REPORT: "/bao-cao",

    ROLE: "/vai-tro",
    DOWNLOAD: "/download",

    CAMERA_MANAGER: "/camera_manager",
    CAMERA: "/camera",
    LIVE_CAMERA: "/live-camera",
    CAMERA_TYPE: "/camera-type",
    UNIT: "/unit",
    POWERLINE: "/powerline",
    POSITION: "/position",
    WARNING: "/warning",
    GENERAL_CATEGORIES: "/general-categories",
    MAPS_CAMERA: "/maps-camera",
    VEHICLE: "/vehicle",
    VEHICLE_LIST: "/vehicle-list",
    NAVIGATION_MAP: '/navigation-map',
    BLACK_LIST: '/black-list'
  },
  RESET_PASSWORD: "/reset-password",
  FORGET_PASSWORD: "/forget-password",

  MY_INFO: "/my-info",
  DASHBOARD_KKTB: "/",

  CAMERA: "/camera",
  CAMERA_ID: "/camera/{0}",
  WARNING_ID: "/warning/{0}",
  CAMERA_ADD: "/them-camera",

  CAMERA_TYPE: "/camera-type",
  CAMERA_TYPE_ID: "/camera-type/{0}",
  CAMERA_TYPE_ADD: "/them-camera-type",

  DOCS_VIEWER: `https://docs.google.com/gview?url=${window.location.origin}{0}&embedded=true`,
  PDF_VIEWER: `${window.location.origin}{0}`,
  OFFICEAPPS_VIEWER: `https://view.officeapps.live.com/op/embed.aspx?src=${window.location.origin}{0}`,
  IMAGE_VIEWER: `${window.location.origin}/api/file/preview/{0}`,

  VEHICLE_ID: "/vehicle-list/{0}",
};
