import { useParams } from 'react-router-dom';
import { Grid, Skeleton, Stack } from '@mantine/core';

import AdminCalendar from '@/components/Calendar/AdminCalendar';
import ScheduleAdminPanel from '@/components/Schedule/ScheduleAdminPanel';
import PageHeader from '@/components/PageHeader';
import { useEvent } from '@/hooks/events';
import { dateShort } from '@/utils/dates';
import dayjs from 'dayjs';

const Layout = ({ children }: { children: React.ReactNode[] }) => {
  const [panel, calendar] = children;
  return (
    <Grid>
      <Grid.Col py={0} xl={2}>
        {panel}
      </Grid.Col>
      <Grid.Col py={0} xl={10}>
        {calendar}
      </Grid.Col>
    </Grid>
  );
};

const PageAdminSchedule = () => {
  const { eventId } = useParams();
  const { data: event, isLoading } = useEvent(eventId);

  if (!eventId) return `No event id provided`;
  if (isLoading) {
    return (
      <>
        <PageHeader isLoading />
        <Layout>
          <Stack spacing="sm">
            {[1, 2, 3].map((index) => (
              <Skeleton key={index} height={50} />
            ))}
          </Stack>
          <Skeleton height="100vh" />
        </Layout>
      </>
    );
  }
  if (!event) return null;
  const isPastEvent = dayjs(event.endDate).isBefore(dayjs());

  return (
    <>
      <PageHeader title={event.name} subtitle={dateShort(event.startDate)} />
      <Layout>
        <ScheduleAdminPanel eventId={event.id} disabled={isPastEvent} />
        <AdminCalendar eventId={event.id} disabled={isPastEvent} />
      </Layout>
    </>
  );
};

export default PageAdminSchedule;
