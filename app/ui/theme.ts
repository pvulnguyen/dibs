import {
  Paper,
  createTheme,
  darken,
  defaultVariantColorsResolver,
  parseThemeColor,
  rem,
  rgba,
} from '@mantine/core';

import type {VariantColorsResolver} from '@mantine/core';

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  if (input.variant === 'light') {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `${rem(1)} solid ${parsedColor.value}`,
      color: darken(parsedColor.value, 0.1),
    };
  }

  return defaultResolvedColors;
};

export const theme = createTheme({
  variantColorResolver,
  fontFamily: 'Satoshi',
  primaryColor: 'dark',
  black: '#141414',
  white: '#f4f4f4',
  defaultRadius: 'sm',
  components: {
    Paper: Paper.extend({
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    }),
  },
});
