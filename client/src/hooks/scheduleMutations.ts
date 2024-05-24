import Api from '@/api';
import { EditScheduleSession, NewScheduleSession, Schedule } from '@competence-assistant/shared';
import { useOptimisticMutation } from './optimisticMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useScheduleMutations = (eventId: string) => {
  const { mutate: createScheduleSession } = useCreateSchedule(eventId);
  const { mutate: editScheduleSession } = useEditScheduleSession(eventId);
  const { mutate: removeScheduleSession } = useRemoveScheduleSession(eventId);

  return { createScheduleSession, editScheduleSession, removeScheduleSession };
};

const useCreateSchedule = (eventId: string) => {
  const queryClient = useQueryClient();
  const updater = (oldData: Schedule | undefined, newItem: NewScheduleSession): Schedule => {
    const now = new Date().toISOString();
    const sessions = [...(oldData?.sessions || []), { ...newItem, id: 'tmp', updatedAt: now, createdAt: now }];
    return { sessions, breaks: oldData?.breaks || [], rooms: oldData?.rooms || [] };
  };

  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['sessions'] });
  return useOptimisticMutation(Api.createScheduleSession, ['schedule', eventId], updater, { onSuccess });
};

const useEditScheduleSession = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newItem: EditScheduleSession): Schedule => {
    const sessions = oldData?.sessions.map((s) => (s.sessionId === newItem.sessionId ? { ...s, ...newItem } : s)) || [];
    return { sessions, breaks: oldData?.breaks || [], rooms: oldData?.rooms || [] };
  };
  return useOptimisticMutation(Api.editScheduleSession, ['schedule', eventId], updater);
};

type RemoveScheduleParams = {
  eventId: string;
  sessionId: string;
};

const useRemoveScheduleSession = (eventId: string) => {
  const queryClient = useQueryClient();

  const updater = (oldData: Schedule | undefined, ids: RemoveScheduleParams): Schedule => {
    const sessions = oldData?.sessions.filter(({ sessionId }) => sessionId !== ids.sessionId) || [];
    return { sessions, breaks: oldData?.breaks || [], rooms: oldData?.rooms || [] };
  };
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['sessions'] });
  return useOptimisticMutation(Api.deleteScheduleSession, ['schedule', eventId], updater, { onSuccess });
};
