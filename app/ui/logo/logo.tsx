import {Anchor, Text} from '@mantine/core';
import {Link} from '@remix-run/react';

import type {TextProps} from '@mantine/core';

export function Logo({...props}: TextProps) {
  return (
    <Anchor component={Link} to="/" underline="never">
      <Text size="1.625rem" lh={1} {...props}>dibs</Text>
    </Anchor>
  );
}
