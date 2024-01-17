import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import mantineStyleSheet from '@mantine/core/styles.css';
import notificationsStyleSheet from '@mantine/notifications/styles.css';
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
  useRevalidator,
} from '@remix-run/react';
import {createBrowserClient} from '@supabase/ssr';
import {useEffect, useState} from 'react';
import {getSupabaseClient} from './db/supabase.server';
import {getEnv} from './utils/get-env';

import type {LinksFunction, LoaderFunctionArgs} from '@remix-run/node';
import type {Database} from './db/types';
import { Notifications } from '@mantine/notifications';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: mantineStyleSheet},
  {rel: 'stylesheet', href: notificationsStyleSheet},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);

  const {
    data: {session},
  } = await supabase.auth.getSession();

  return json({ENV: getBrowserEnv(), session}, {headers});
}

export default function App() {
  const {ENV, session} = useLoaderData<typeof loader>();
  const serverAccessToken = session?.access_token;
  const {revalidate} = useRevalidator();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY),
  );

  useEffect(() => {
    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== 'INITIAL_SESSION' && session?.access_token !== serverAccessToken) {
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, revalidate, serverAccessToken]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications zIndex={1000} />
          <Outlet context={{supabase}} />
          <ScrollRestoration />
          <script dangerouslySetInnerHTML={{__html: `window.ENV = ${JSON.stringify(ENV)}`}} />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}

function getBrowserEnv() {
  const env = getEnv();

  if (!env.BASE_URL) {
    throw new Error('BASE_URL is not set');
  }

  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not set');
  }

  if (!env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY is not set');
  }

  return {
    BASE_URL: env.BASE_URL,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  };
}
