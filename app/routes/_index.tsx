import {Group, Title} from '@mantine/core';
import {redirect, json} from '@remix-run/node';
import {getOnboardingStatus} from '~/auth/get-onboarding-status';
import {getSupabaseClient} from '~/db/supabase.server';
import {useSession} from '~/root';
import {AppShell, AuthButtons, Logo} from '~/ui';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);

  const onboarded = await getOnboardingStatus(supabase);
  if (onboarded === false) {
    throw redirect('/getting-started', {headers});
  }
  
  return json({});
}

export default function Index() {
  const session = useSession();

  if (session) {
    return (
      <AppShell>
        <Title>Home</Title>
      </AppShell>
    );
  }

  return (
    <>
      <Group component="header" justify="space-between" h="3rem" px="md">
        <Logo />
        <AuthButtons />
      </Group>
      <Title>Hello, World!</Title>
    </>
  );
}
