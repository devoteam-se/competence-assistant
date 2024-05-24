import { Box, Group, Pagination } from '@mantine/core';
import { SessionFilter, SessionOrder } from '@competence-assistant/shared';

import CardGrid from '@/components/CardGrid';
import Filter from './Filter';
import Sort from './Sort';
import SessionCard from '../Session/SessionCard';
import { useSessions } from '@/hooks/sessions';
import { useTranslation } from 'react-i18next';

interface Props {
  initialOrder?: SessionOrder;
  initalFilter?: SessionFilter;
  eventId?: string;
}

export const Sessions = ({ initialOrder, initalFilter, eventId }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'grid' });
  const { sessions, sort, filter, pagination } = useSessions({ initialOrder, initalFilter, eventId });

  return (
    <Box>
      <Group position="right" mb="sm">
        <Filter
          active={filter.active}
          onApply={filter.apply}
          onClear={filter.clear}
          hasFilter={filter.hasFilter}
          eventId={eventId}
        />

        <Sort active={sort.active} applySort={sort.apply} hasSort={sort.hasSort} />
      </Group>

      <CardGrid isLoading={sessions.isLoading} emptyText={t(filter.hasFilter ? 'noMatch' : 'empty')}>
        {sessions.data.map((session) => (
          <SessionCard key={session.id} data={session} showEvent showRibbon />
        ))}
      </CardGrid>

      {pagination.totalPages > 1 && (
        <Pagination
          position="center"
          onChange={pagination.onChange}
          value={pagination.activePage}
          total={pagination.totalPages}
          mt="md"
        />
      )}
    </Box>
  );
};
