import { useAuth } from '@/contexts/auth';
import { useVotes } from '@/hooks/votes';
import { openConfirmModal } from '@/utils/openModal';
import { Session } from '@competence-assistant/shared';
import { Button, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  session: Session;
};

const VoteButton = ({ session }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'vote' });
  const { addVote, removeVote } = useVotes({ sessionId: session.id, eventId: session.eventId });
  const { currentUser } = useAuth();

  const currentUserHasVoted = useMemo(
    () => Boolean(session.voters && session.voters.find(({ id }) => id === currentUser?.id)),
    [session.voters, currentUser],
  );

  const isFull = useMemo(
    () => session.maxParticipants && session.voters && session.maxParticipants <= session.voters.length,
    [session.maxParticipants, session.voters],
  );

  const onClick = () => {
    if (currentUserHasVoted) return removeVote();
    if (!isFull) return addVote();

    openConfirmModal({
      title: t('fullTitle'),
      children: <Text>{t('fullDescription')}</Text>,
      onConfirm: () => addVote(),
      labels: { confirm: t('confirm'), cancel: t('cancel') },
    });
  };

  return (
    <Button
      color={currentUserHasVoted ? 'green' : 'primary'}
      onClick={onClick}
      radius="xl"
      rightIcon={currentUserHasVoted && <IconCircleCheck />}
    >
      {t(currentUserHasVoted ? 'registered' : 'join')}
    </Button>
  );
};

export default VoteButton;
