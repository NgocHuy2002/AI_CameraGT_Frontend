import React, { lazy } from "react";
import {
  HomeIcon,
  SettingIcon,
  UserIcon,
  CameraIcon,
  CameraTypeIcon,
  UnitIcon,
  PositionIcon,
  WarningIcon,
  ListIcon,
  MapsCameraIcon,
  VehicleIcon,
  VehicleRoadIcon,
} from "@app/components/Icons";

import { URL } from "@url";
import { create } from "@app/rbac/permissionHelper";
import resources from "@app/rbac/resources";
import actions from "@app/rbac/actions";
import { CONSTANTS_MODULE } from "@constants";
import { t } from "i18next";

const ForgetPassword = lazy(() => import("@containers/Authenticator/ForgetPassword"));
const ResetPassword = lazy(() => import("@containers/Authenticator/ResetPassword"));

const MyInfo = lazy(() => import("@containers/MyInfo/MyInfo"));
const TrangChu = lazy(() => import("@containers/TrangChu/TrangChu"));
const Setting = lazy(() => import("@containers/Setting/Setting"));
const User = lazy(() => import("@containers/User/User"));
const KhoiPhucTaiKhoan = lazy(() => import("@containers/User/KhoiPhucTaiKhoan"));
const Role = lazy(() => import("@containers/Role/Role"));
// ------------------- categories

const Camera = lazy(() => import("@containers/Camera/CameraList/Camera"));
const LiveCam = lazy(() => import("@containers/Camera/LiveCam/LiveCam"))
const CameraType = lazy(() => import("@containers/CameraType/CameraType"));
const CameraDetail = lazy(() => import("@containers/Camera/CameraDetail/CameraDetail"));

const Unit = lazy(() => import("@containers/Unit/Unit"));

const Position = lazy(() => import("@containers/Position/Position"));

// const Warning = lazy(() => import("@containers/Warning/Warning"));
// const WarningDetail = lazy(() => import("@containers/Warning/ModifyWarning"));

const MapsCamera = lazy(() => import('@containers/MapsCamera/MapsCamera'));

const NavigationMap = lazy(() => import('@containers/NavigationMap/NavigationMap'));

const VehicleList = lazy(() => import('@containers/Vehicle/VehicleList/VehicleList'));
const VehicleDetail = lazy(() => import('@containers/Vehicle/VehicleDetail/VehicleDetail'));
const BlackList = lazy(() => import('@containers/Vehicle/BlackList/BlackList'));

// const Ward = lazy(() => import('@containers/Ward/Ward'));

function renderIcon(icon) {
  return (
    <span role="img" className="main-menu__icon">
      <div className="position-absolute" style={{ top: "50%", transform: "translateY(-50%)" }}>
        <div className="position-relative" style={{ width: "30px", height: "30px" }}>
          {icon}
        </div>
      </div>
    </span>
  );
}

const MY_INFO_ROUTE = { path: URL.MY_INFO, breadcrumbName: t("THONG_TIN_CA_NHAN"), component: MyInfo, permission: [] };

export const ADMIN_ROUTES = [
  // { isRedirect: true, from: '/', to: URL.MENU.DASHBOARD },
  {
    path: URL.MENU.DASHBOARD,
    menuName: "TRANG_CHU",
    component: TrangChu,
    icon: renderIcon(<HomeIcon />),
    permission: [],
  },
  {
    key: URL.MENU.VEHICLE,
    menuName: "VEHICLE",
    icon: renderIcon(<VehicleIcon />),
    permission: [create(resources.VEHICLE, actions.READ)],
    children: [
      {
        path: URL.MENU.VEHICLE_LIST,
        menuName: "VEHICLE_LIST",
        permission: [create(resources.VEHICLE, actions.READ)],
        component: VehicleList,
      },
      {
        path: URL.MENU.BLACK_LIST,
        menuName: "BLACK_LIST",
        permission: [create(resources.VEHICLE, actions.READ)],
        component: BlackList,
      },
      {
        path: URL.VEHICLE_ID.format(":id"),
        breadcrumbName: "CHI_TIET",
        component: VehicleDetail,
        permission: [create(resources.VEHICLE, actions.READ)],
      },
    ]
  },
  {
    path: URL.MENU.MAPS_CAMERA,
    menuName: "MAPS_CAMERA",
    component: MapsCamera,
    permission: [create(resources.MAPS_CAMERA, actions.READ)],
    icon: renderIcon(<MapsCameraIcon />),
  },
  {
    path: URL.MENU.NAVIGATION_MAP,
    component: NavigationMap,
    menuName: "NAVIGATION_MAP",
    permission: [create(resources.MAPS_CAMERA, actions.READ)],
    icon: renderIcon(<VehicleRoadIcon />),
  },
  {
    key: URL.MENU.CAMERA_MANAGER,
    menuName: "CAMERA_MANAGER",
    permission: [create(resources.CAMERA, actions.READ)],
    icon: renderIcon(<CameraIcon />),
    children: [
      {
        path: URL.MENU.CAMERA,
        menuName: "CAMERA_LIST",
        permission: [create(resources.CAMERA, actions.READ)],
        component: Camera,
      },
      {
        path: URL.MENU.LIVE_CAMERA,
        menuName: 'LIVE_CAMERA',
        component: LiveCam,
        permission: [create(resources.CAMERA, actions.READ)],
      },
      {
        path: URL.CAMERA_ID.format(":id"),
        breadcrumbName: "CHI_TIET",
        component: CameraDetail,
        permission: [create(resources.CAMERA, actions.READ)],
      },
    ],
  },
  {
    path: URL.MENU.UNIT,
    menuName: "UNIT",
    component: Unit,
    permission: [create(resources.UNIT, actions.READ)],
    icon: renderIcon(<UnitIcon />),
  },
  {
    path: URL.MENU.POSITION,
    menuName: "POSITION",
    component: Position,
    permission: [create(resources.POSITION, actions.READ)],
    icon: renderIcon(<PositionIcon />),
  },
  {
    key: URL.MENU.GENERAL_CATEGORIES,
    menuName: "DANH_MUC_CHUNG",
    icon: renderIcon(<ListIcon />),
    children: [
      {
        path: URL.MENU.CAMERA_TYPE,
        menuName: "CAMERA_TYPE",
        component: CameraType,
        permission: [create(resources.CAMERA_TYPE, actions.READ)],
      },
    ],
  },
  {
    key: URL.MENU.USER_MANAGEMENT,
    menuName: "NGUOI_DUNG",
    icon: renderIcon(<UserIcon />),
    children: [
      {
        path: URL.MENU.USER,
        menuName: "DANH_SACH_NGUOI_DUNG",
        component: User,
        permission: [create(resources.USER, actions.READ)],
      },
      {
        path: URL.MENU.KHOI_PHUC_TAI_KHOAN,
        menuName: "KHOI_PHUC_TAI_KHOAN",
        component: KhoiPhucTaiKhoan,
        permission: [create(resources.USER, actions.READ)],
      },
      {
        path: URL.MENU.ROLE,
        menuName: "VAI_TRO",
        component: Role,
        permission: [create(resources.VAI_TRO, actions.READ)],
      },
      // {
      //   path: URL.MENU.WARD,
      //   menuName: "WARD",
      //   component: Ward,
      //   permission: [create(resources.WARD, actions.WARD)],
      // },
    ],
  },
  {
    path: URL.MENU.SETTING,
    menuName: "CAI_DAT_HE_THONG",
    component: Setting,
    permission: [create(resources.SETTING, actions.READ)],
    icon: renderIcon(<SettingIcon />),
  },
  // not render in menu
  // { path: URL.MENU.DOWNLOAD, breadcrumbName: 'Tải xuống', component: Download, permission: [] },
  MY_INFO_ROUTE,
];

export function ConstantsRoutes(moduleApp) {
  switch (moduleApp) {
    case CONSTANTS_MODULE.QUAN_LY_CAMERA_CANH_BAO.code:
      return ADMIN_ROUTES;
    default:
      return [];
  }
}
