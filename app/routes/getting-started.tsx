import {Box, Button, Flex, Paper, Text, TextInput, Title} from '@mantine/core';
import {useForm} from '@mantine/form';
import {IconArrowRight} from '@tabler/icons-react';
import {useSupabase} from '~/root';
import {json} from '@remix-run/node';
import {getSupabaseClient} from '~/db/supabase.server';
import {getUser} from '~/auth/get-user';

import type {LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData, useNavigate} from '@remix-run/react';
import {showNotification} from '@mantine/notifications';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);
  const user = await getUser(supabase);
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
