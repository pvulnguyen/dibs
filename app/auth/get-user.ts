import {getSession} from './get-session';

import type {SupabaseClient} from '@supabase/supabase-js';
import type {Database} from '~/db/types';

export async function getUser(supabase: SupabaseClient<Database>) {
  const session = await getSession(supabase);

  if (!session) {
    return null;
  }

  const {data} = await supabase
    .schema('public')
    .from('users')
    .select('*')
    .eq('account_id', session.user.id)
    .maybeSingle();

  return data;
}
