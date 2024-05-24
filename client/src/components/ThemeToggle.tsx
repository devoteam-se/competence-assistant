import { useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconMoonOff } from '@tabler/icons-react';
import IconButton, { Props } from './IconButton';
import { IconSize } from '@/utils/icons';

const ThemeToggle = (props: Props) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <IconButton size="xl" variant="transparent" onClick={() => toggleColorScheme()} {...props}>
      {colorScheme === 'light' ? <IconMoon size={IconSize.xl} /> : <IconMoonOff size={IconSize.xl} />}
    </IconButton>
  );
};

export default ThemeToggle;
