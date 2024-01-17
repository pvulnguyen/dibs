import {Burger, Button, Group, AppShell as MantineAppShell} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import {IconCalendar, IconLogout, IconTags, IconUsersGroup} from '@tabler/icons-react';
import {useSupabase} from '~/root';
import {Logo} from '../logo';

export function AppShell({children}: {children: React.ReactNode}) {
  const [opened, {toggle}] = useDisclosure();
  const supabase = useSupabase();

  return (
    <MantineAppShell
      padding="md"
      header={{height: 60}}
      navbar={{breakpoint: 'sm', collapsed: {mobile: !opened}, width: 300}}
    >
      <MantineAppShell.Header>
        <Group justify="space-between" h="100%" px="md">
          <Logo fw={700} />
          <Burger size="sm" hiddenFrom="sm" opened={opened} onClick={toggle} />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">
        <Button
          component={Link}
          to="/appointments"
          variant="subtle"
          size="md"
          justify="start"
          leftSection={<IconCalendar />}
        >
          Appointments
        </Button>
        <Button
          component={Link}
          to="/clients"
          variant="subtle"
          size="md"
          justify="start"
          leftSection={<IconUsersGroup />}
        >
          Clients
        </Button>
        <Button
          component={Link}
          to="/services"
          variant="subtle"
          size="md"
          justify="start"
          leftSection={<IconTags />}
        >
          Services
        </Button>
        <Button
          type="button"
          size="md"
          mt="auto"
          justify="start"
          leftSection={<IconLogout />}
          onClick={() => supabase.auth.signOut()}
        >
          Log Out
        </Button>
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
