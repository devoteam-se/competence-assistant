import React from 'react';
import { ColorScheme, ColorSchemeProvider as MantineColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { theme } from '@/styles/theme';

const ColorSchemeProvider = ({ children }: { children: React.ReactElement }) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <MantineColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...theme, colorScheme }}>
        {children}
      </MantineProvider>
    </MantineColorSchemeProvider>
  );
};

export default ColorSchemeProvider;
