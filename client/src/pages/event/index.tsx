import { IconCalendarStats, IconPresentation } from '@tabler/icons-react';
import { useParams, useLocation, Outlet, Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEvent } from '@/hooks/events';

import PageHeader from '@/components/PageHeader';
import VotingEndsBanner from '@/components/VotingEndsBanner';
import { dateShort } from '@/utils/dates';
import { useSchedule } from '@/hooks/schedule';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const usePathHelper = (eventId?: string) => {
  const { pathname } = useLocation();
  if (!eventId) return;
  const base = `/events/${eventId}`;

  return {
    sessions: `${base}/sessions`,
    schedule: `${base}/schedule`,
    isSessionPage: pathname.startsWith(`${base}/sessions`),
    isSchedulePage: pathname.startsWith(`${base}/schedule`),
  };
};

const PageEvent = () => {
  const { eventId } = useParams();
  const path = usePathHelper(eventId);
  const { t } = useTranslation('schedule');
  const navigate = useNavigate();
  const { data: event, isLoading: loadingEvent } = useEvent(eventId);
  const { schedulingStarted, isLoading: loadingSchedule } = useSchedule(eventId);

  const isLoading = loadingEvent || loadingSchedule;
  const title = event ? event.name : '';
  const subtitle = event ? dateShort(event.startDate) : '';
  const onGoingVoting = event?.votingEndDate && dayjs().isBefore(event.votingEndDate);
  const banner = onGoingVoting && <VotingEndsBanner date={event.votingEndDate!} />;

  useEffect(() => {
    if (isLoading || !path) return;
    if (!path.isSessionPage && !path.isSchedulePage) {
      return navigate(schedulingStarted && !onGoingVoting ? path.schedule : path.sessions, { replace: true });
    }

    if (path.isSchedulePage && !schedulingStarted) {
      return navigate(path.sessions, { replace: true });
    }
  }, [isLoading, navigate, schedulingStarted, onGoingVoting, path]);

  const actions =
    !onGoingVoting && schedulingStarted
      ? [
          {
            label: t('sessions'),
            icon: <IconPresentation />,
            component: Link,
            to: `/events/${eventId}/sessions`,
            variant: path?.isSessionPage ? 'filled' : 'outline',
          },
          {
            label: t('schedule'),
            icon: <IconCalendarStats />,
            component: Link,
            to: `/events/${eventId}/schedule`,
            variant: path?.isSchedulePage ? 'filled' : 'outline',
          },
        ]
      : [];

  return (
    <>
      <PageHeader isLoading={isLoading} title={title} subtitle={subtitle} banner={banner} actions={actions} />
      <Outlet />
    </>
  );
};

export default PageEvent;
