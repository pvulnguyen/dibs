import type {SupabaseClient} from '@supabase/supabase-js';

export async function getSession(supabase: SupabaseClient) {
  const {
    data: {session},
  } = await supabase.auth.getSession();

  return session;
}
