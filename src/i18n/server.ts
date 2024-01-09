import Backend from 'i18next-fs-backend';
import {resolve} from 'node:path';
import {RemixI18Next} from 'remix-i18next';
import {getI18nConfig} from './configuration';

const options = getI18nConfig();

export const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: options.supportedLngs,
    fallbackLanguage: options.fallbackLng,
  },
  i18next: {
    ...options,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  plugins: [Backend],
});
