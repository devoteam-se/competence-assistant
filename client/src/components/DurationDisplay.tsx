import { IconSize } from '@/utils/icons';
import { Group, Text } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

type Props = {
  duration: number;
  size?: 'md' | 'sm' | 'xs';
};
const sizes = {
  md: {
    text: 'md',
    icon: IconSize.lg,
    gap: 6,
  },
  sm: {
    text: 'sm',
    icon: IconSize.md,
    gap: 4,
  },
  xs: {
    text: 'xs',
    icon: IconSize.xs,
    gap: 2,
  },
};
const DurationDisplay = ({ duration, size = 'md' }: Props) => {
  const s = sizes[size];
  const text = duration >= 60 ? `${duration / 60}h` : duration + 'min';
  return (
    <Group spacing={s.gap}>
      <IconClock size={s.icon} />
      <Text inline size={s.text}>
        {text}
      </Text>
    </Group>
  );
};

export default DurationDisplay;
