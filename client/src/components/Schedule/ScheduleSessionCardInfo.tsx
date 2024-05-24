import DurationDisplay from '@/components/DurationDisplay';
import { IconSize } from '@/utils/icons';
import { Group, Text } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

type Props = {
  votes: number;
  duration: number;
};

const ScheduleSessionCardInfo = ({ votes, duration }: Props) => {
  return (
    <Group spacing="xs">
      <Group spacing={2}>
        <IconUsers size={IconSize.xs} />
        <Text inline size="xs">
          {votes}
        </Text>
      </Group>
      <DurationDisplay size="xs" duration={duration} />
    </Group>
  );
};

export default ScheduleSessionCardInfo;
