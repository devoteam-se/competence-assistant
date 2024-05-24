import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell as MantineAppShell, Container, Overlay, useMantineTheme, Stack } from '@mantine/core';

import Header from './Header';
import Navbar from './Navbar';

export const NAVBAR_BREAKPOINT = 'xl';
const minimalLayoutSearchParam = '?layout=minimal';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const theme = useMantineTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [appShellHidden, setAppShellHidden] = useState(location.search === minimalLayoutSearchParam);

  useEffect(() => {
    if (location.search === minimalLayoutSearchParam) {
      setAppShellHidden(true);
    }
  }, [location.search]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <MantineAppShell
      hidden={appShellHidden}
      header={<Header open={open} toggleNavbar={() => setOpen((o) => !o)} />}
      navbar={<Navbar open={open} />}
      navbarOffsetBreakpoint={NAVBAR_BREAKPOINT}
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colorScheme === 'light' ? theme.colors.gray[0] : theme.colors.dark[7],
        },
      })}
    >
      {open && (
        <Overlay
          opacity={0.6}
          blur={2}
          zIndex={5}
          onClick={() => setOpen(false)}
          color={theme.colorScheme === 'light' ? theme.white : theme.colors.dark[7]}
        />
      )}

      <Container p="md" fluid>
        <Stack>{children}</Stack>
      </Container>
    </MantineAppShell>
  );
};

export default AppShell;
