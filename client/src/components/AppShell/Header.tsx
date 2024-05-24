import { Header as MantineHeader, Burger, Group, Image, useMantineTheme } from '@mantine/core';

import LogoSmall from '@/assets/devoteam_rgb_round.svg';
import LogoLarge from '@/assets/devoteam_rgb.svg';
import LogoLargeDark from '@/assets/devoteam_rgb_dark.svg';
import { Link } from 'react-router-dom';
import { NAVBAR_BREAKPOINT } from '.';
import ThemeToggle from '../ThemeToggle';
import useIsMobile from '@/hooks/isMobile';
import { useMediaQuery } from '@mantine/hooks';

type HeaderProps = {
  open: boolean;
  toggleNavbar: (o: boolean) => void;
};

export const HEIGHT = 70;

const Header = ({ open, toggleNavbar }: HeaderProps) => {
  const theme = useMantineTheme();
  const isMobile = useIsMobile();
  const navVisible = useMediaQuery(`(min-width: ${theme.breakpoints[NAVBAR_BREAKPOINT]})`);

  return (
    <MantineHeader height={HEIGHT}>
      <Group position="apart" align="center" h="100%" px="md">
        <Burger
          opened={open}
          onClick={() => toggleNavbar(!open)}
          style={navVisible ? { opacity: 0, pointerEvents: 'none' } : {}}
        />

        <Link to="/">
          {isMobile ? (
            <Image src={LogoSmall} alt="Devoteam" width={48} height={48} />
          ) : (
            <Image
              src={theme.colorScheme === 'light' ? LogoLarge : LogoLargeDark}
              alt="Devoteam"
              width={200}
              height={HEIGHT - 8}
            />
          )}
        </Link>

        <ThemeToggle />
      </Group>
    </MantineHeader>
  );
};

export default Header;
