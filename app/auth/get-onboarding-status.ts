import {getSession} from './get-session';

import type {SupabaseClient} from '@supabase/supabase-js';
import type {Database} from '~/db/types';

export async function getOnboardingStatus(supabase: SupabaseClient<Database>) {
  const session = await getSession(supabase);
  
  if (!session) return null;

  const {data} = await supabase
    .from('users')
    .select('onboarded')
    .eq('account_id', session.user.id)
    .maybeSingle();

  return data?.onboarded ?? null;
}
