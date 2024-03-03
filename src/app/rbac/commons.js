import { t } from 'i18next';

export const RESOURCES = [
  { code: 'ALL', description: t('TAT_CA') },
  { code: 'USER', description: t('NGUOI_DUNG') },
  { code: 'VAI_TRO', description: t('VAI_TRO') },
  { code: 'SETTING', description: t('CAI_DAT') },
  { code: 'CAMERA', description: t('CAMERA') },
  { code: 'CAMERA_TYPE', description: t('CAMERA_TYPE') },
  { code: 'UNIT', description: t('UNIT') },
  { code: 'POSITION', description: t('POSITION') },
  { code: 'WARNING', description: t('WARNING') },
  { code: 'MAPS_CAMERA', description: t('MAPS_CAMERA') },
  { code: 'VEHICLE', description: t('VEHICLE') },
];
// permissions?.workResult
export const ACTIONS = [
  { code: 'READ', description: t('XEM'), title: t('XEM') },
  { code: 'CREATE', description: t('THEM'), title: t('THEM') },
  { code: 'UPDATE', description: t('SUA_DE_XUAT'), title: t('SUA_DE_XUAT') },
  { code: 'DELETE', description: t('XOA'), title: t('XOA') },
  { code: 'ALL', description: t('TAT_CA'), title: t('TAT_CA') }];
