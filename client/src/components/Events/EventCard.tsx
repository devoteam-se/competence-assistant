import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Group, Text, Title, Stack, Card, Divider, Button } from '@mantine/core';
import { IconCalendarEvent, IconPresentation, IconUsers, IconListCheck, IconCalendarClock } from '@tabler/icons-react';

import { EventWithUniqueVoters } from '@competence-assistant/shared';
import EventActions from './EventActions';
import { useTranslation } from 'react-i18next';
import { dateLong, dateShort } from '@/utils/dates';
import { IconSize } from '@/utils/icons';

type Props = {
  data: EventWithUniqueVoters;
};

const EventCard = ({ data: event }: Props) => {
  const { t } = useTranslation('event', { keyPrefix: 'card' });

  const isOneDayEvent = dayjs(event.startDate).isSame(dayjs(event.endDate), 'day');
  const registrationOpen = dayjs().isBefore(dayjs(event.votingEndDate));

  return (
    <Card p="lg" radius="md" withBorder>
      <Stack h="100%">
        <Group noWrap align="flex-start" position="apart">
          <Title order={4} weight={500}>
            {event.name}
          </Title>
          <EventActions event={event} />
        </Group>

        <Divider />

        <Stack spacing="xl" justify="space-between" h="100%">
          <Stack spacing="xs">
            <Group spacing="xs">
              <IconCalendarEvent size={IconSize.md} />
              <Text size="sm" inline>
                {isOneDayEvent
                  ? dateLong(event.startDate)
                  : t('dates', {
                      start: dateShort(event.startDate),
                      end: dateShort(event.endDate),
                    })}
              </Text>
            </Group>
            <Group spacing="xs">
              <IconPresentation size={IconSize.md} />
              <Text size="sm" inline>
                {t('sessionCount', { count: event.sessionCount ?? 0 })}
              </Text>
            </Group>
            <Group spacing="xs">
              <IconUsers size={IconSize.md} />
              <Text size="sm" inline>
                {t('attendeeCount', { count: event.uniqueVoters ?? 0 })}
              </Text>
            </Group>

            {event.votingEndDate && (
              <Group spacing="xs">
                <IconListCheck size={IconSize.md} />
                <Text size="sm" inline>
                  {t(registrationOpen ? 'registrationDeadline' : 'registrationClosed', {
                    date: dateShort(event.votingEndDate),
                  })}
                </Text>
              </Group>
            )}
          </Stack>
          <Button
            leftIcon={<IconCalendarClock size={IconSize.lg} />}
            variant="subtle"
            component={Link}
            to={`/admin/schedules/${event.id}`}
          >
            {t('schedule')}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default EventCard;
