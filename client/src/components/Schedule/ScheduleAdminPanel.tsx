import { Accordion, Stack, Text, Alert, Skeleton } from '@mantine/core';
import React from 'react';

import ScheduleSession from './ScheduleSession';
import ScheduleSessionCardInfo from './ScheduleSessionCardInfo';

import Breaks from './Breaks';
import { useTranslation } from 'react-i18next';
import Rooms from './Rooms';
import { IconAlertCircle } from '@tabler/icons-react';
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

const ScheduleAdminPanel = ({ eventId, disabled = false }: { eventId: string; disabled?: boolean }) => {
  const { t } = useTranslation('schedule');
  const { isLoading, unscheduledSessions } = useSchedule(eventId);

  return (
    <Stack spacing="sm">
      {disabled && (
        <Alert color="yellow" icon={<IconAlertCircle />}>
          {t('pastAlert')}
        </Alert>
      )}
      {!disabled && (
        <Accordion variant="filled" styles={{ content: { padding: 0 } }}>
          <AccordionSection title={t('rooms.title')}>
            <Rooms eventId={eventId} />
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
