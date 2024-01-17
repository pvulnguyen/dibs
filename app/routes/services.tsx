import {Title} from '@mantine/core';
import {json, redirect} from '@remix-run/node';
import {getOnboardingStatus} from '~/auth/get-onboarding-status';
import {getSupabaseClient} from '~/db/supabase.server';
import {AppShell} from '~/ui';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);
  const onboarded = await getOnboardingStatus(supabase);
  if (onboarded === false) {
    throw redirect('/getting-started', {headers});
  }
  return json({});
}

export default function Services() {
  return (
    <AppShell>
      <Title>Services</Title>
    </AppShell>
  );
}
