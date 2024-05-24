import Api from '@/api';
import { useAuth } from '@/contexts/auth';
import type { Session } from '@competence-assistant/shared';

import { useOptimisticMutation } from './optimisticMutation';
import { useQueryClient } from '@tanstack/react-query';

type Props = { sessionId: string; eventId?: string | null };
export const useVotes = ({ eventId, sessionId }: Props) => {
  if (!eventId) throw new Error('eventId is required');

  const { mutate: addVote } = useAddVote({ sessionId, eventId });
  const { mutate: removeVote } = useRemoveVote({ sessionId, eventId });

  return { addVote, removeVote };
};

type Ids = { sessionId: string; eventId: string };
const useAddVote = ({ sessionId, eventId }: Ids) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const voteUpdater = (oldData: Session | undefined) => {
    if (!oldData || !currentUser) return;

    return { ...oldData, voters: [...(oldData.voters || []), currentUser] };
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
  };

  return useOptimisticMutation(() => Api.vote({ sessionId, eventId }), ['sessions', sessionId], voteUpdater, {
    onSuccess,
  });
};

const useRemoveVote = ({ sessionId, eventId }: Ids) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const voteUpdater = (oldData: Session | undefined) => {
    if (!oldData || !currentUser) return;

    return { ...oldData, voters: oldData.voters?.filter(({ id }) => id !== currentUser.id) };
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
  };

  return useOptimisticMutation(() => Api.removeVote({ sessionId, eventId }), ['sessions', sessionId], voteUpdater, {
    onSuccess,
  });
};
