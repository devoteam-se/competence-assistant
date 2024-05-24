import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';

i18next.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en },
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});

export default i18next;
