import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import {cssBundleHref} from '@remix-run/css-bundle';
import {json} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {useTranslation} from 'react-i18next';
import {useChangeLanguage} from 'remix-i18next';
import {i18next} from '~/i18n/server';
import {getAppConfig} from './configuration';

import type {LinksFunction, LoaderFunctionArgs} from '@remix-run/node';

const config = getAppConfig();

export const links: LinksFunction = () => [
  ...config.head.styleSheets,
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export async function loader({request}: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request);
  return json({
    locale,
    ENV: getBrowserEnv(),
  });
}

export const handle = {
  i18n: 'common',
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const {i18n} = useTranslation();

  useChangeLanguage(data.locale);

  return (
    <html lang={data.locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={config.mantineTheme}>
          <Outlet />
          <ScrollRestoration />
          <script dangerouslySetInnerHTML={{__html: `window.ENV = ${JSON.stringify(data.ENV)}`}} />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}

function getBrowserEnv() {
  const env = process.env;

  return {
    BASE_URL: env.BASE_URL,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  };
}
