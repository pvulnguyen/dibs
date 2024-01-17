import {
  Anchor,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {showNotification} from '@mantine/notifications';
import {json, redirect} from '@remix-run/node';
import {Link, useOutletContext} from '@remix-run/react';
import {zodResolver} from 'mantine-form-zod-resolver';
import {useState} from 'react';
import {z} from 'zod';
import {getSupabaseClient} from '~/db/supabase.server';

import type {LoaderFunctionArgs} from '@remix-run/node';
import type {SupabaseClient} from '@supabase/supabase-js';
import type {Database} from '~/db/types';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);

  const {
    data: {session},
  } = await supabase.auth.getSession();

  if (session) return redirect('/', {headers});

  return json({});
}

export default function SignUp() {
  const {supabase} = useOutletContext<{supabase: SupabaseClient<Database>}>();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must contain at least 8 characters'),
      }),
    ),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);

    const {error} = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.ENV.BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      setLoading(false);

      showNotification({
        message: error.message,
        color: 'red',
      });
    } else {
      setLoading(false);

      showNotification({
        message: 'Please check your email for a confirmation link',
        color: 'green',
      });
    }
  });

  return (
    <Container size="xs" py="xl">
      <LoadingOverlay visible={loading} />
      <Paper p="xl" shadow="sm" withBorder>
        <Title ta="center">Sign Up</Title>
        <form onSubmit={handleSubmit}>
          <TextInput label="Email" mt="xl" {...form.getInputProps('email')} />
          <PasswordInput label="Password" mt="md" {...form.getInputProps('password')} />
          <Button type="submit" mt="xl" fullWidth>
            Create Account
          </Button>
        </form>
      </Paper>
      <Group gap="xs" justify="center" mt="md">
        <Text>Already have an account?</Text>
        <Anchor component={Link} to="/sign-in">
          Sign in
        </Anchor>
      </Group>
    </Container>
  );
}
