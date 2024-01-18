import {Box, Button, Flex, Paper, Text, TextInput, Title} from '@mantine/core';
import {useForm} from '@mantine/form';
import {showNotification} from '@mantine/notifications';
import {json, redirect} from '@remix-run/node';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {IconArrowRight} from '@tabler/icons-react';
import {zodResolver} from 'mantine-form-zod-resolver';
import {z} from 'zod';
import {getSession} from '~/auth/get-session';
import {getUser} from '~/auth/get-user';
import {getSupabaseClient} from '~/db/supabase.server';
import {useSupabase} from '~/root';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);

  const session = await getSession(supabase);

  const user = await getUser(supabase);

  if (!session || !user) {
    throw redirect('/sign-in', {headers});
  }

  return json({user}, {headers});
}

export default function GettingStarted() {
  const {user} = useLoaderData<typeof loader>();
  const supabase = useSupabase();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      displayName: '',
      firstName: '',
      lastName: '',
    },
    validate: zodResolver(
      z.object({
        username: z.string().min(4, 'Username is not available'),
        displayName: z.string().min(2, 'Display name is too short'),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
    ),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const {error} = await supabase.from('profiles').insert({
      user_id: user?.id,
      username: values.username,
      display_name: values.displayName,
      first_name: values.firstName ?? null,
      last_name: values.lastName ?? null,
    });

    if (error) {
      showNotification({
        message: error.message,
        color: 'red',
      });
    } else {
      showNotification({
        message: 'Profile created!',
        color: 'green',
      });
      
      navigate('/');
    }
  });

  return (
    <Box maw="36rem" mx="auto" py="4rem" w="100%">
      <Box pl="xl" w="100%" maw="26rem" mx="auto">
        <Title>Welcome to dibs!</Title>
        <Text>We just need a few things to set up your profile.</Text>
      </Box>
      <Paper p="xl" mt="xl" component="form" onSubmit={handleSubmit}>
        <TextInput label="Username" required {...form.getInputProps('username')} />
        <TextInput label="Display Name" mt="md" required {...form.getInputProps('displayName')} />
        <Flex gap="md" mt="md">
          <TextInput label="First Name" w="100%" {...form.getInputProps('firstName')} />
          <TextInput label="Last Name" w="100%" {...form.getInputProps('lastName')} />
        </Flex>
        <Button type="submit" mt="xl" rightSection={<IconArrowRight size={19} />} fullWidth>
          Continue
        </Button>
      </Paper>
    </Box>
  );
}
