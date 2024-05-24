import { useQueryClient } from '@tanstack/react-query';

import Api from '@/api';
import { findItemById } from '@/utils/findItem';
import { sendNotification } from '@/utils/notifications';
import { EditEvent, Event, NewEvent } from '@competence-assistant/shared';

import { useOptimisticMutation } from './optimisticMutation';
import { useTranslation } from 'react-i18next';

export const useEventMutations = () => {
  const { mutate: createEvent } = useCreateEvent();
  const { mutate: editEvent } = useEditEvent();
  const { mutate: removeEvent } = useRemoveEvent();

  return { createEvent, editEvent, removeEvent };
};

const useCreateEvent = () => {
  const { t } = useTranslation('event', { keyPrefix: 'notifications' });
  const queryClient = useQueryClient();

  const updater = (oldData: Event[] | undefined, newEventData: NewEvent) => {
    const now = new Date().toISOString();
    return [...(oldData || []), { ...newEventData, id: 'tmp', createdAt: now, updatedAt: now, active: false }];
  };

  const onSuccess = (_oldData: Event | undefined, newEventData: NewEvent) => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    sendNotification({ status: 'SUCCESS', message: t('created', { name: newEventData.name }) });
  };

  return useOptimisticMutation(Api.createEvent, ['events'], updater, { onSuccess });
};

const useEditEvent = () => {
  const { t } = useTranslation('event', { keyPrefix: 'notifications' });

  const queryClient = useQueryClient();
  const updater = (oldData: Event[] | undefined, newEventData: EditEvent) => {
    const oldEvent = findItemById(oldData, newEventData.id);
    const editedEvent: Event = { ...oldEvent!, ...newEventData };
    return oldData?.map((event) => (event.id === editedEvent.id ? editedEvent : event)) || [];
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    sendNotification({ status: 'INFO', message: t('updated') });
  };
  return useOptimisticMutation(Api.editEvent, ['events'], updater, { onSuccess });
};

const useRemoveEvent = () => {
  const { t } = useTranslation('event', { keyPrefix: 'notifications' });

  const updater = (oldData: Event[] | undefined, id: Event['id']) => {
    return oldData?.filter((event) => event.id !== id) || [];
  };
  const onSuccess = () => {
    sendNotification({ status: 'INFO', message: t('deleted') });
  };
  return useOptimisticMutation(Api.deleteEvent, ['events'], updater, { onSuccess });
};

export const useToggleEventActive = (active: boolean) => {
  const { t } = useTranslation('event', { keyPrefix: 'notifications' });

  const updater = (oldData: Event[] | undefined, selectedEventId: string) => {
    return oldData?.map((event) => (event.id === selectedEventId ? { ...event, active: !event.active } : event)) || [];
  };
  const onSuccess = () => {
    sendNotification({ status: 'INFO', message: t(active ? 'hidden' : 'shown') });
  };

  const fn = active ? Api.deactivateEvent : Api.activateEvent;
  const mutation = useOptimisticMutation(fn, ['events'], updater, { onSuccess });
  return mutation.mutate;
};
