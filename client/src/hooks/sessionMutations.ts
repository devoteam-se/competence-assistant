import { useQueryClient } from '@tanstack/react-query';

import Api from '@/api';
import { findDataByKeyAndId } from '@/utils/findItem';
import { sendNotification } from '@/utils/notifications';
import { EditSession, NewSession, Session, User } from '@competence-assistant/shared';

import { useOptimisticMutation } from './optimisticMutation';
import { useTracks } from './tracks';
import { useUsers } from './users';

const getUsers = (users: string[], allUsers: User[] | undefined) => {
  return users.flatMap((u) => allUsers?.find((a) => a.id === u) || []);
};

export const useSessionMutations = () => {
  const { mutate: createSession } = useCreateSession();
  const { mutate: editSession } = useEditSession();
  const { mutate: removeSession } = useRemoveSession();

  return { createSession, editSession, removeSession };
};

const useCreateSession = () => {
  const queryClient = useQueryClient();
  const { data: tracks } = useTracks();
  const { users } = useUsers();

  const updater = (oldData: Session[] | undefined, newSession: NewSession): Session[] => {
    const now = new Date().toISOString();

    const newItem: Session = {
      ...newSession,
      id: 'tmp',
      createdAt: now,
      updatedAt: now,
      hosts: getUsers(newSession.hosts, users.data),
      voters: [],
      tracks: newSession.tracks.flatMap((t) => tracks?.find((track) => track.id === t) || []),
    };
    return [...(oldData || []), newItem];
  };

  const onSuccess = (_oldData: unknown, newSession: NewSession) => {
    // If the session is included in an event, refetch the event
    if (newSession.eventId) {
      queryClient.invalidateQueries({ queryKey: ['events', newSession.eventId] });
    }

    sendNotification({ status: 'SUCCESS', message: `Created ${newSession.name} ${newSession.type.toLowerCase()}` });
  };
  return useOptimisticMutation(Api.createSession, ['sessions'], updater, { onSuccess });
};

const useEditSession = () => {
  const { data: tracks } = useTracks();
  const { users } = useUsers();
  const queryClient = useQueryClient();

  const updater = (oldData: Session[] | undefined, newSessionData: EditSession): Session[] => {
    const now = new Date().toISOString();

    const editedSession: Session = {
      ...newSessionData,
      tracks: newSessionData.tracks.flatMap((t) => tracks?.find((track) => track.id === t) || []),
      voters: findDataByKeyAndId(oldData, 'voters', newSessionData.id) || [],
      hosts: getUsers(newSessionData.hosts, users.data),
      createdAt: now,
      updatedAt: now,
    };

    return oldData?.map((session) => (session.id === newSessionData.id ? editedSession : session)) || [];
  };

  const onSuccess = (_oldData: unknown, newSession: EditSession, context: any) => {
    const oldEventId = findDataByKeyAndId(context as Session[], 'eventId', newSession.id);
    const newEventId = newSession.eventId;

    // If the session is included in an event, refetch the event
    if (oldEventId) {
      queryClient.invalidateQueries({ queryKey: ['events', oldEventId] });
    }
    if (newEventId && newEventId !== oldEventId) {
      queryClient.invalidateQueries({ queryKey: ['events', newEventId] });
    }

    sendNotification({ status: 'INFO', message: `Updated ${newSession.name} ${newSession.type.toLowerCase()}` });
  };

  return useOptimisticMutation(Api.editSession, ['sessions'], updater, { onSuccess });
};

const useRemoveSession = () => {
  const queryClient = useQueryClient();
  const updater = (oldData: Session[] | undefined, id: Session['id']) => {
    return oldData?.filter((session) => session.id !== id) || [];
  };

  const onSuccess = (_oldData: unknown, sessionId: string, context: any) => {
    const removedSession = context.find((t: Session) => t.id === sessionId);

    // If the session was included in an event, refetch the event
    if (removedSession?.eventId) {
      queryClient.invalidateQueries({ queryKey: ['events', removedSession.eventId] });
    }

    sendNotification({ status: 'INFO', message: `Removed ${removedSession?.name ?? 'session'}` });
  };
  return useOptimisticMutation(Api.removeSession, ['sessions'], updater, { onSuccess });
};
