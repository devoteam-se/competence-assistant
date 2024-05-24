import { CalendarEventType, type AttendeeConflict, type HostConflict, type SessionEventSource } from '@/hooks/schedule';
import { IconSize } from '@/utils/icons';
import { EventContentArg } from '@fullcalendar/react';
import { Divider, Group, HoverCard, Stack, Text, rem, useMantineTheme } from '@mantine/core';
import { IconInfoCircle, IconAlertTriangle, IconUserExclamation, IconClipboardList } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const Helpers = ({ event }: { event: EventContentArg['event'] }) => {
  const { t } = useTranslation('schedule', { keyPrefix: 'calendarEvent' });
  const theme = useMantineTheme();
  const attendees = (event.extendedProps.attendees || []).length;
  const hostConflicts: HostConflict[] = event.extendedProps.hostConflicts || [];
  const attendeeConflicts: AttendeeConflict[] = event.extendedProps.attendeeConflict || [];

  if (event.extendedProps.type !== CalendarEventType.SESSION) return null;

  return (
    <HoverCard withinPortal width={350} shadow="md">
      <HoverCard.Target>
        <IconInfoCircle size={IconSize.md} style={{ cursor: 'pointer' }} />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack spacing="xs">
          <Group spacing="xs" noWrap>
            <IconClipboardList size={IconSize.md} color={theme.colors.blue[6]} />
            <Text inline size="xs">
              {t('votes', { count: attendees })}
            </Text>
          </Group>
          {hostConflicts.length > 0 && (
            <>
              <Divider />
              <Stack spacing={0}>
                {hostConflicts.map(({ name, id, sessions }) => (
                  <Group spacing="xs" key={id} noWrap>
                    <IconAlertTriangle size={IconSize.md} color={theme.colors.red[6]} />
                    <Text inline size="xs">
                      {t('hostConflicts', { name, sessions: sessions.map(({ title }) => title).join(', ') })}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </>
          )}
          {attendeeConflicts.length > 0 && (
            <>
              <Divider />
              <Stack spacing={0}>
                {attendeeConflicts.map(({ session, overlapCount }) => (
                  <Group spacing="xs" key={session.id} noWrap>
                    <IconUserExclamation size={IconSize.md} color={theme.colors.yellow[6]} />
                    <Text inline size="xs">
                      {t('voteConflicts', { session: session.title, count: overlapCount })}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

type Props = {
  args: EventContentArg;
  showHelpers: boolean;
};

const CalendarEvent = ({ args: { event }, showHelpers }: Props) => {
  const { t } = useTranslation('schedule', { keyPrefix: 'calendarEvent' });
  const hosts: SessionEventSource['hosts'] = event.extendedProps.hosts;
  const start = dayjs(event.start).format('H:mm');
  const end = dayjs(event.end).format('H:mm');

  return (
    <Stack spacing={0} p={rem(4)}>
      <Group position="apart" spacing={rem(4)}>
        <Text size="xs">{`${start} - ${end}`}</Text>
        {showHelpers && <Helpers event={event} />}
      </Group>
      <Text weight="600" size="sm" lineClamp={2}>
        {event.title}
      </Text>
      {hosts && hosts.length > 0 && (
        <Text italic size="xs">
          {t('by', { names: hosts.map(({ name }) => name).join(', ') })}
        </Text>
      )}
    </Stack>
  );
};

export default CalendarEvent;
