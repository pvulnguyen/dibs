import {ColorSchemeScript, MantineProvider} from '@mantine/core';
import mantineStyleSheet from '@mantine/core/styles.css';
import {Notifications} from '@mantine/notifications';
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
  useOutletContext,
  useRevalidator,
} from '@remix-run/react';
import {createBrowserClient} from '@supabase/ssr';
import {useEffect, useMemo} from 'react';
import {getSession} from '~/auth/get-session';
import {getSupabaseClient} from '~/db/supabase.server';
import globalStyleSheet from '~/ui/styles.css';
import {theme} from '~/ui/theme';
import {getEnv} from '~/utils/get-env';

import type {LinksFunction, LoaderFunctionArgs} from '@remix-run/node';
import type {Session, SupabaseClient} from '@supabase/supabase-js';
import type {Database} from '~/db/types';

type RootContext = {
  supabase: SupabaseClient;
  session: Session | null;
};

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: mantineStyleSheet},
  {rel: 'stylesheet', href: notificationsStyleSheet},
  {rel: 'stylesheet', href: globalStyleSheet},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);
  const session = await getSession(supabase);
  return json({ENV: getBrowserEnv(), session}, {headers});
}

export default function App() {
  const {ENV, session} = useLoaderData<typeof loader>();
  const serverAccessToken = session?.access_token;
  const {revalidate} = useRevalidator();

  const supabase = useMemo(
    () => createBrowserClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_KEY),
    [ENV.SUPABASE_URL, ENV.SUPABASE_KEY],
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
        <MantineProvider theme={theme}>
          <Notifications zIndex={1000} />
          <Outlet context={{supabase, session} satisfies RootContext} />
          <ScrollRestoration />
          <script dangerouslySetInnerHTML={{__html: `window.ENV = ${JSON.stringify(ENV)}`}} />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}

export function useSupabase() {
  return useOutletContext<RootContext>().supabase;
}

export function useSession() {
  return useOutletContext<RootContext>().session;
}

function getBrowserEnv() {
  const env = getEnv();

  if (!env.BASE_URL) {
    throw new Error('BASE_URL is not set');
  }

  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not set');
  }

  if (!env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY is not set');
  }

  return {
    BASE_URL: env.BASE_URL,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_KEY: env.SUPABASE_KEY,
  };
}
