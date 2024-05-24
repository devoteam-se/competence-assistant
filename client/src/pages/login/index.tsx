import { useAuth } from '@/contexts/auth';
import { Box, Button, createStyles, Flex, Text, Title, useMantineColorScheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { Canvas } from '@react-three/fiber';
import { Navigate } from 'react-router-dom';
import { Scene } from './Scene';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '@/components/ThemeToggle';
const breakpoints = {
  sm: 600,
  md: 841,
  lg: 1219,
};

const useStyles = createStyles((theme) => ({
  stack: {
    [theme.fn.smallerThan(breakpoints.md)]: {
      position: 'absolute',
      top: '60%',
      zIndex: 1,
    },
  },
  title: {
    fontSize: 130,
    color: theme.colorScheme === 'light' ? '#3c3c3a' : '#f0f0f0',
    lineHeight: '0.5',
    fontWeight: 'lighter',
    userSelect: 'none',

    [theme.fn.smallerThan(breakpoints.lg)]: {
      fontSize: 70,
    },
    [theme.fn.smallerThan(breakpoints.sm)]: {
      fontSize: 50,
    },
  },
  subtitle: {
    display: 'block',
    fontWeight: 'bold',
    [theme.fn.smallerThan(breakpoints.sm)]: {
      textAlign: 'center',
    },
  },
  themeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  canvas: {
    maxWidth: '400px',
    overflow: 'visible',
  },
}));

const PageLogin = () => {
  const { t } = useTranslation('login');
  const { currentUser, signIn } = useAuth();
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const { width } = useViewportSize();
  const isMobile = width < breakpoints.sm;

  if (currentUser) return <Navigate to="/" replace />;

  return (
    <Flex h="100vh" justify="center" align="center" wrap="wrap-reverse">
      <Box className={classes.stack}>
        <Title className={classes.title}>
          {t('title')}
          <Text className={classes.subtitle}>{t('subtitle')}</Text>
        </Title>
        <Button radius="xl" size={isMobile ? 'md' : 'lg'} onClick={signIn} fullWidth={isMobile}>
          {t('signIn')}
        </Button>
      </Box>
      <ThemeToggle className={classes.themeToggle} />
      <Canvas shadows camera={{ position: [0, 1, 20], fov: 18 }} className={classes.canvas}>
        <Scene small={width < breakpoints.md} light={colorScheme === 'light'} />
      </Canvas>
    </Flex>
  );
};

export default PageLogin;
