import {Button, Group} from '@mantine/core';
import {Link} from '@remix-run/react';

export function AuthButtons({forHeader}: {forHeader?: boolean}) {
  return (
    <Group visibleFrom={forHeader ? 'sm' : ''}>
      <Button component={Link} to="/sign-up" size="compact-sm" variant="light">
        Sign Up
      </Button>
      <Button component={Link} to="/sign-in" size="compact-sm">
        Sign In
      </Button>
    </Group>
  );
}
