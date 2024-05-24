import Api from '@/api';
import { findItemById } from '@/utils/findItem';
import { Break, DeleteBreak, EditBreak, NewBreak, Schedule } from '@competence-assistant/shared';
import { useOptimisticMutation } from './optimisticMutation';

export const useBreakMutations = (eventId: string) => {
  const { mutate: createScheduleBreak } = useCreateScheduleBreak(eventId);
  const { mutate: editScheduleBreak } = useEditScheduleBreak(eventId);
  const { mutate: removeScheduleBreak } = useRemoveScheduleBreak(eventId);

  return { createScheduleBreak, editScheduleBreak, removeScheduleBreak };
};

const useCreateScheduleBreak = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: NewBreak): Schedule => {
    const now = new Date().toISOString();
    const breaks = [...(oldData?.breaks || []), { ...newData, id: 'tmp', updatedAt: now, createdAt: now }];

    return { breaks, sessions: oldData?.sessions || [], rooms: oldData?.rooms || [] };
  };
  return useOptimisticMutation(Api.createScheduleBreak, ['schedule', eventId], updater);
};

const useEditScheduleBreak = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: EditBreak): Schedule => {
    const now = new Date().toISOString();

    const editedBreak: Break = {
      updatedAt: now,
      createdAt: now,
      ...findItemById(oldData?.breaks, newData.id),
      ...newData,
    };
    const updatedBreaks: Break[] = oldData?.breaks.map((b) => (b.id === newData.id ? editedBreak : b)) || [];

    return { breaks: updatedBreaks, sessions: oldData?.sessions || [], rooms: oldData?.rooms || [] };
  };
  return useOptimisticMutation(Api.editScheduleBreak, ['schedule', eventId], updater);
};

const useRemoveScheduleBreak = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: DeleteBreak): Schedule => {
    const breaks = oldData?.breaks.filter((b) => b.id !== newData.id) || [];

    return { breaks, sessions: oldData?.sessions || [], rooms: oldData?.rooms || [] };
  };
  return useOptimisticMutation(Api.deleteScheduleBreak, ['schedule', eventId], updater);
};
