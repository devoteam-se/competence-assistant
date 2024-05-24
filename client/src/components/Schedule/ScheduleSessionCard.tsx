import { CalendarEventType } from '@/hooks/schedule';
import { getTextColor } from '@/utils/colors';
import { Card, Stack, Text } from '@mantine/core';
import React from 'react';

type Props = {
  id: string;
  name: string;
  color: string;
  duration: number;
  type: CalendarEventType;
  children?: React.ReactNode;
};

const ScheduleSessionCard = React.forwardRef(
  ({ id, name, color, duration, type, children }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <Card
        key={id}
        ref={ref}
        className="fc-event"
        title={name}
        data-id={id}
        data-type={type}
        data-duration={duration}
        data-title={name}
        padding="xs"
        sx={{ background: color, color: getTextColor(color) }}
      >
        <Stack>
          <Text weight="500" size="sm">
            {type === CalendarEventType.BREAK ? `${name} - ${duration}m` : name}
          </Text>
          {children}
        </Stack>
      </Card>
    );
  },
);

ScheduleSessionCard.displayName = 'ScheduleSessionCard';

export default ScheduleSessionCard;
