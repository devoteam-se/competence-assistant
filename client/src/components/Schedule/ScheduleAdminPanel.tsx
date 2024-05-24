import { Accordion, Stack, Text, Alert, Skeleton } from '@mantine/core';
import React from 'react';

import dayjs from 'dayjs';
import ScheduleSession from './ScheduleSession';
import ScheduleSessionCardInfo from './ScheduleSessionCardInfo';

import Breaks from './Breaks';
import { useTranslation } from 'react-i18next';
import Rooms from './Rooms';
import { IconAlertCircle } from '@tabler/icons-react';
import { Event } from '@competence-assistant/shared';
import { CalendarEventType, useSchedule } from '@/hooks/schedule';

const AccordionSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <Accordion.Item value={title}>
      <Accordion.Control p={0}>
        <Text weight="bold" size="sm">
          {title}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>{children}</Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

const ScheduleAdminPanel = ({ event }: { event: Event }) => {
  const { t } = useTranslation('schedule');
  const { isLoading, unscheduledSessions } = useSchedule(event.id);

  const isPastEvent = dayjs(event.endDate).isBefore(dayjs());

  return (
    <Stack spacing="sm">
      {isPastEvent && (
        <Alert color="yellow" icon={<IconAlertCircle />}>
          {t('pastAlert')}
        </Alert>
      )}
      {!isPastEvent && (
        <Accordion variant="filled" styles={{ content: { padding: 0 } }}>
          <AccordionSection title={t('rooms.title')}>
            <Rooms eventId={event.id} />
          </AccordionSection>

          <AccordionSection title={t('sessions')}>
            {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} height={50} />)}
            {unscheduledSessions.map((session) => (
              <ScheduleSession
                key={session.id}
                id={session.id}
                name={session.name}
                duration={session.duration}
                color={session.tracks ? session.tracks[0]?.color : '#dadada'}
                type={CalendarEventType.SESSION}
              >
                <ScheduleSessionCardInfo
                  votes={session.voters ? session.voters.length : 0}
                  duration={session.duration}
                />
              </ScheduleSession>
            ))}
          </AccordionSection>

          <AccordionSection title={t('breaks.title')}>
            <Breaks />
          </AccordionSection>
        </Accordion>
      )}
    </Stack>
  );
};

export default ScheduleAdminPanel;
