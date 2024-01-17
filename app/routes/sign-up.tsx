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
import {json, redirect} from '@remix-run/node';
import {Link} from '@remix-run/react';
import {zodResolver} from 'mantine-form-zod-resolver';
import {getSession} from '~/auth/get-session';
import {useSignUpWithEmail} from '~/auth/hooks/use-sign-up-with-email';
import {authSchema} from '~/auth/validation';
import {getSupabaseClient} from '~/db/supabase.server';
import {useSupabase} from '~/root';

import type {LoaderFunctionArgs} from '@remix-run/node';

export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = getSupabaseClient(request);
  const session = await getSession(supabase);
  if (session) return redirect('/', {headers});

  return json({});
}

export default function SignUp() {
  const supabase = useSupabase();
  const {signUp, loading} = useSignUpWithEmail(supabase);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(authSchema),
  });

  return (
    <Container size="xs" py="xl">
      <LoadingOverlay visible={loading} />
      <Paper p="xl" shadow="sm" withBorder>
        <Title ta="center">Sign Up</Title>
        <form onSubmit={form.onSubmit(signUp)}>
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
