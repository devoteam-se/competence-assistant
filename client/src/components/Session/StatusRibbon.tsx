import { SessionStatus } from '@/hooks/sessionHelpers';
import { getTextColor } from '@/utils/colors';
import { Box, MantineTheme, Text, useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';

type Props = {
  status: SessionStatus;
};

function getBackgroundColor(theme: MantineTheme, status: SessionStatus): string {
  switch (status) {
    case SessionStatus.Voting:
      return theme.colors.yellow[theme.colorScheme === 'light' ? 5 : 7];
    case SessionStatus.Scheduled:
      return theme.colors.green[theme.colorScheme === 'light' ? 5 : 7];
    case SessionStatus.Done:
      return theme.colors.blue[theme.colorScheme === 'light' ? 5 : 7];
    case SessionStatus.Draft:
    default:
      return theme.colors.red[theme.colorScheme === 'light' ? 5 : 7];
  }
}

const Ribbon = ({ status }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'status' });
  const theme = useMantineTheme();
  const background = getBackgroundColor(theme, status);
  const color = getTextColor(background);

  return (
    <Box
      sx={() => ({
        background,
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '140px',
        height: '80px',
        transform: 'translate(50px, 20px) rotate(-45deg)',
        paddingTop: '4px',
      })}
    >
      <Text align="center" color={color} fz="md" fw="600">
        {t(status)}
      </Text>
    </Box>
  );
};

export default Ribbon;
