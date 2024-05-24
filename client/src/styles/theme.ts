import { MantineThemeOverride, MantineTheme } from '@mantine/core';

export const theme: MantineThemeOverride = {
  primaryShade: 9,
  fontFamily: 'Montserrat, sans-serif',
  headings: {
    fontFamily: 'Montserrat, sans-serif',
  },
  focusRingStyles: {
    // reset styles are applied to <button /> and <a /> elements
    // in &:focus:not(:focus-visible) selector to mimic
    // default browser behavior for native <button /> and <a /> elements
    resetStyles: () => ({ outline: 'none' }),

    // styles applied to all elements expect inputs based on Input component
    // styled are added with &:focus selector
    styles: (theme: MantineTheme) => ({
      outline: `1px solid ${theme.colorScheme === 'light' ? theme.colors.dark[9] : theme.white}`,
    }),

    // focus styles applied to components that are based on Input
    // styled are added with &:focus selector
    inputStyles: (theme: MantineTheme) => ({
      outline: 'none',
      borderColor: theme.colorScheme === 'light' ? `${theme.colors.dark[9]}` : `${theme.white}`,
    }),
  },
  globalStyles: (theme: MantineTheme) => ({
    ['.mantine-Modal-title']: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 700,
    },
    '.mantine-Switch-root, .mantine-Radio-root, .mantine-Checkbox-root': {
      cursor: 'pointer',
    },
    // reset 'cursor: default' on the elements inside Switch Radio and Checkbox components,
    // otherwise it overwrites pointer
    '.mantine-Switch-root div, .mantine-Switch-root label, .mantine-Radio-labelWrapper, .mantine-Radio-root label, .mantine-Radio-root input, .mantine-Checkbox-labelWrapper, .mantine-Checkbox-root label, .mantine-Checkbox-root input':
      {
        cursor: 'unset',
      },
  }),
};
