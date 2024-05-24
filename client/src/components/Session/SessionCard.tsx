import { memo, useEffect, useRef, useState } from 'react';
import { Button, Card, Divider, Flex, Group, NavLink, Stack, Text, Title } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { Session } from '@competence-assistant/shared';
import { Link } from 'react-router-dom';
import { dateShort } from '@/utils/dates';

import useIsMobile from '@/hooks/isMobile';
import { useSessionHelpers } from '@/hooks/sessionHelpers';
import Markdown from '@/components/Markdown';

import UserStack from '@/components/UserStack';
import { openModal } from '@/utils/openModal';

import SessionActions from './SessionActions';
import SessionInfo from './SessionInfo';
import SessionModal from './SessionModal';
import StatusRibbon from './StatusRibbon';
import VoteButton from './VoteButton';
import { useEvent } from '@/hooks/events';
import { useTranslation } from 'react-i18next';
import { IconSize } from '@/utils/icons';

type SessionCardProps = {
  data: Session;
  showEvent?: boolean;
  showRibbon?: boolean;
};

const SessionCard = ({ data: session, showEvent, showRibbon }: SessionCardProps) => {
  const { t } = useTranslation('common');

  const { data: event } = useEvent(session.eventId);
  const { canVote, showVoters, status } = useSessionHelpers({ session, event });
  const isMobile = useIsMobile();
  const refDescription = useRef<HTMLDivElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    if (refDescription.current && refDescription.current.scrollHeight > refDescription.current.clientHeight) {
      setShowReadMore(true);
    }
  }, [session]);

  const openSessionModal = () => {
    openModal({
      title: session.name,
      fullScreen: isMobile,
      children: <SessionModal sessionId={session.id} event={event} />,
    });
  };

  return (
    <Card p="lg" radius="md" h="100%" pos="relative" withBorder>
      <Stack h="100%">
        <Group noWrap position="apart">
          <Title size="lg">{session.name}</Title>
          <SessionActions data={{ session, event }} />
        </Group>

        <Divider />

        {session.hosts && <UserStack users={session.hosts} />}

        <SessionInfo session={session} showVoters={showVoters} />

        <Stack h="100%" spacing={0}>
          <Text lineClamp={7} ref={refDescription}>
            <Markdown>{session.description}</Markdown>
          </Text>

          {showReadMore && (
            <Flex mt="xs" justify="center">
              <Button variant="subtle" onClick={openSessionModal} size="xs">
                {t('readMore')}
              </Button>
            </Flex>
          )}
        </Stack>

        {canVote && (
          <Group mt="auto" position="center">
            <VoteButton session={session} />
          </Group>
        )}

        {showEvent && event && (
          <>
            <Divider />
            <NavLink
              label={event.name}
              description={dateShort(event.startDate)}
              icon={<IconCalendar size={IconSize.lg} />}
              component={Link}
              to={`/events/${event.id}`}
            />
          </>
        )}
      </Stack>
      {status && showRibbon && <StatusRibbon status={status} />}
    </Card>
  );
};

export default memo(SessionCard);
