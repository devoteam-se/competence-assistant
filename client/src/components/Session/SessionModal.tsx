import { Divider, Group, Stack } from '@mantine/core';

import SessionInfo from './SessionInfo';
import UsersList from '../UserList';
import VoteButton from './VoteButton';

import Markdown from '@/components/Markdown';
import { EventWithUniqueVoters, Event } from '@competence-assistant/shared';
import { useSessionHelpers } from '@/hooks/sessionHelpers';
import { useSession } from '@/hooks/sessions';
import FavouriteStar from './FavouriteStar';

export type Props = {
  sessionId: string;
  event?: EventWithUniqueVoters | Event;
};

const SessionModal = ({ sessionId, event }: Props) => {
  const { data: session, isLoading } = useSession(sessionId);
  const { canVote } = useSessionHelpers({ session, event });

  if (isLoading) return 'loading...';
  if (!session) return null;

  return (
    <Stack>
      <SessionInfo session={session} />
      <Markdown>{session.description}</Markdown>
      <Divider />
      <Group position="apart">
        <Group grow>{session.hosts && <UsersList users={session.hosts} size="sm" />}</Group>
        <Group>
          <FavouriteStar isFavourite={session.favourite} sessionId={session.id} />
          {canVote && <VoteButton session={session} />}
        </Group>
      </Group>
    </Stack>
  );
};

export default SessionModal;
