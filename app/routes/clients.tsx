import {Title} from '@mantine/core';
import {json, redirect} from '@remix-run/node';
import {getOnboardingStatus} from '~/auth/get-onboarding-status';
import {getSession} from '~/auth/get-session';
import {getSupabaseClient} from '~/db/supabase.server';
import {AppShell} from '~/ui';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);

  const session = await getSession(supabase);
  if (!session) {
    throw redirect('/sign-in', {headers});
  }

  const onboarded = await getOnboardingStatus(supabase);
  if (onboarded === false) {
    throw redirect('/getting-started', {headers});
  }
  
  return json({});
}

export default function Clients() {
  return (
    <AppShell>
      <Title>Clients</Title>
    </AppShell>
  );
}
