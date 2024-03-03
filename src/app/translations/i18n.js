import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { translationsEN } from './lang_en';
import { translationsVI } from './lang_vi';
import { translationsMsgEN } from './msg_lang_en';
import { translationsMsgVI } from './msg_lang_vi';
import { CONSTANTS } from '@constants';

const resources = {
  en: {
    translations: { ...translationsEN, ...translationsMsgEN },
  },
  vi: {
    translations: { ...translationsVI, ...translationsMsgVI },
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || CONSTANTS.LANG_VI,
    fallbackLng: CONSTANTS.LANG_VI,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
