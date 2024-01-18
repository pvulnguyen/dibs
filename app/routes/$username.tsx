import {Title} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {getSupabaseClient} from '~/db/supabase.server';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request, params}: LoaderFunctionArgs) {
  const username = params.username;

  if (!username) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const {supabase, headers} = getSupabaseClient(request);

  const {data} = await supabase.from('profiles').select('*').eq('username', username).maybeSingle();
  
  if (!data) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return {profile: data, headers};
}

export default function Profile() {
  const {profile} = useLoaderData<typeof loader>();

  return (
    <>
      <Title>{profile.display_name}</Title>
    </>
  );
}
