import { useParams } from 'react-router-dom';

import { Group, Skeleton, Text } from '@mantine/core';
import { useEventSessions } from '@/hooks/sessions';
import SessionsFilter from '@/components/Sessions/Filter';
import { useSchedule } from '@/hooks/schedule';
import Calendar from '@/components/Calendar/Calendar';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const PageEventSchedule = () => {
  const { t } = useTranslation('event', { keyPrefix: 'schedule' });
  const { eventId } = useParams();
  const { isEmpty, breaks, sessions: schedueled, isLoading } = useSchedule(eventId);
  const { sessions: filtered, filter } = useEventSessions(eventId);

  const sessions = useMemo(() => {
    const filteredIds = filtered.data.map(({ id }) => id);
    return schedueled.map((s) => (filteredIds.includes(s.sessionId) ? s : { ...s, status: 'disabled' as const }));
  }, [filtered, schedueled]);

  if (!eventId) return null;

  if (isLoading) {
    return <Skeleton height="100vh" />;
  }

  return (
    <>
      <Group position="right">
        <SessionsFilter
          active={filter.active}
          onApply={filter.apply}
          onClear={filter.clear}
          hasFilter={filter.hasFilter}
          eventId={eventId}
        />
      </Group>

      {isEmpty && (
        <Text align="center" mt="xl">
          {t('empty')}
        </Text>
      )}

      {!isEmpty && <Calendar eventId={eventId} calendarEvents={[...sessions, ...breaks]} />}
    </>
  );
};

export default PageEventSchedule;
