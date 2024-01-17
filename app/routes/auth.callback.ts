import {redirect} from '@remix-run/node';
import {getSupabaseClient} from '~/db/supabase.server';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return redirect('/', {headers});
}
