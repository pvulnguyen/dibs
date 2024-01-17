import {createServerClient, parse, serialize} from '@supabase/ssr';
import {getEnv} from '~/utils/get-env';

import type {Database} from './types';

export function getSupabaseClient(request: Request) {
  const env = getEnv();

  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL is not set');
  }

  if (!env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY is not set');
  }

  const cookies = parse(request.headers.get('Cookie') ?? '');

  const headers = new Headers();

  const supabase = createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_KEY, {
    cookies: {
      get: (key) => {
        return cookies[key];
      },
      set: (key, value, options) => {
        headers.append('Set-Cookie', serialize(key, value, options));
      },
      remove: (key, options) => {
        headers.append('Set-Cookie', serialize(key, '', options));
      },
    },
  });

  return {supabase, headers};
}
