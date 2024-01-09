import mantineStyleSheet from '@mantine/core/styles.css';
import fontsStyleSheet from '~/ui/stylesheets/fonts.css';
import {getEnv} from '~/utils/get-env';

import {type MantineThemeOverride} from '@mantine/core';

export function getAppConfig() {
  const env = getEnv() ?? {};

  return {
    name: 'dibs',
    baseUrl: env.BASE_URL || 'http://localhost:3000',
    head: {
      styleSheets: [
        {rel: 'stylesheet', href: mantineStyleSheet},
        {rel: 'stylesheet', href: fontsStyleSheet},
      ],
    },
    mantineTheme: {
      fontFamily: 'Satoshi',
      primaryColor: 'dark',
      black: '#141414',
      white: '#f4f4f4',
    } satisfies MantineThemeOverride,
  };
}
