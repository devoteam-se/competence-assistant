import Api from '@/api';
import { NewRoom, Room, Schedule } from '@competence-assistant/shared';
import { useOptimisticMutation } from './optimisticMutation';

export const useRoomMutations = (eventId: string) => {
  const { mutate: createRoom } = useCreateRoom(eventId);
  const { mutate: setRoomTemplate } = useSetRoomTemplate(eventId);
  const { mutate: resetRoomTemplate } = useResetRoomTemplate(eventId);
  const { mutate: removeRoom } = useRemoveRoom(eventId);

  return { createRoom, setRoomTemplate, resetRoomTemplate, removeRoom };
};

const useRemoveRoom = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: { eventId: string; roomId: string }): Schedule => {
    const updatedRooms: Room[] = oldData?.rooms.filter((r) => r.id !== newData.roomId) || [];

    return { breaks: oldData?.breaks || [], sessions: oldData?.sessions || [], rooms: updatedRooms };
  };
  return useOptimisticMutation(Api.deleteRoom, ['schedule', eventId], updater);
};

const useCreateRoom = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: NewRoom): Schedule => {
    const now = new Date().toISOString();
    const updatedRooms: Room[] = [...(oldData?.rooms || []), { ...newData, id: 'tmp', createdAt: now, updatedAt: now }];

    return { breaks: oldData?.breaks || [], sessions: oldData?.sessions || [], rooms: updatedRooms };
  };
  return useOptimisticMutation(Api.createRoom, ['schedule', eventId], updater);
};

const useResetRoomTemplate = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: { roomIds: string[]; eventId: string }) => {
    const updatedRooms: Room[] = oldData?.rooms.filter((r) => !newData.roomIds.includes(r.id)) || [];

    return { breaks: oldData?.breaks || [], sessions: oldData?.sessions || [], rooms: updatedRooms };
  };
  return useOptimisticMutation(Api.resetRoomTemplate, ['schedule', eventId], updater);
};

const useSetRoomTemplate = (eventId: string) => {
  const updater = (oldData: Schedule | undefined, newData: { roomNames: { name: string }[]; eventId: string }) => {
    const now = new Date().toISOString();

    const updatedRooms: Room[] = newData.roomNames.map(({ name }, i) => ({
      id: `tmp-${i}`,
      name,
      eventId,
      createdAt: now,
      updatedAt: now,
    }));
    return { breaks: oldData?.breaks || [], sessions: oldData?.sessions || [], rooms: updatedRooms };
  };
  return useOptimisticMutation(Api.setRoomTemplate, ['schedule', eventId], updater);
};
