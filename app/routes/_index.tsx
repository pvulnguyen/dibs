import {Group, Title} from '@mantine/core';
import {useSession} from '~/root';
import {AppShell, AuthButtons, Logo} from '~/ui';

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
