import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const useIsMobile = () => {
  const theme = useMantineTheme();
  return useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
};

export default useIsMobile;
