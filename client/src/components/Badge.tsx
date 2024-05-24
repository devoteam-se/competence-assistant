import { getTextColor, hexToRgb } from '@/utils/colors';
import { useMantineColorScheme, Badge as MantineBadge } from '@mantine/core';

type Props = {
  label: string;
  color: string;
};

const Badge = ({ label, color }: Props) => {
  const { colorScheme } = useMantineColorScheme();

  const rgb = hexToRgb(color);
  let backgroundColor = color;

  if (rgb) {
    const { r, g, b } = rgb;
    if (colorScheme === 'dark') {
      backgroundColor = `rgb(${r / 1.3}, ${g / 1.3}, ${b / 1.3}, 1)`;
    } else {
      backgroundColor = `rgb(${r}, ${g}, ${b}, 1)`;
    }
  }

  return <MantineBadge sx={{ color: getTextColor(color), backgroundColor }}>{label}</MantineBadge>;
};

export default Badge;
