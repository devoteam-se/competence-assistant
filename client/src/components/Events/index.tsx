import { Pagination, Box, Group } from '@mantine/core';
import { useEvents } from '@/hooks/events';
import CardGrid from '../CardGrid';
import Filter from './Filter';
import Sort from './Sort';
import EventCard from './EventCard';
import { useTranslation } from 'react-i18next';

const Events = () => {
  const { events, pagination, filter, sort } = useEvents();
  const { t } = useTranslation('event', { keyPrefix: 'grid' });

  return (
    <Box>
      <Group position="right" mb="sm">
        <Filter active={filter.active} onApply={filter.apply} onClear={filter.clear} hasFilter={filter.hasFilter} />
        <Sort active={sort.active} applySort={sort.apply} hasSort={sort.hasSort} />
      </Group>
      <CardGrid isLoading={events.isLoading} emptyText={t(filter.hasFilter ? 'noMatch' : 'empty')}>
        {events.data.map((event) => (
          <EventCard key={event.id} data={event} />
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
export default Events;
