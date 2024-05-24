import Api from '@/api';
import { sendNotification } from '@/utils/notifications';
import { EditTrack, NewTrack, Session, SessionTrack, Track } from '@competence-assistant/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOptimisticMutation } from './optimisticMutation';

export const useTracks = () => {
  return useQuery({ queryKey: ['tracks'], queryFn: Api.getTracks, staleTime: Infinity });
};

export const useTrackMutations = () => {
  const { mutate: createTrack } = useCreateTrack();
  const { mutate: editTrack } = useEditTrack();
  const { mutate: removeTrack } = useRemoveTrack();

  return { createTrack, editTrack, removeTrack };
};

const useCreateTrack = () => {
  const updater = (oldData: SessionTrack[] | undefined, newTrack: NewTrack): SessionTrack[] => [
    ...(oldData || []),
    {
      ...newTrack,
      id: 'tmp',
      obsolete: false,
    },
  ];

  const onSuccess = (data: SessionTrack) => {
    sendNotification({ status: 'SUCCESS', message: `Created ${data.name} track` });
  };

  return useOptimisticMutation(Api.createTrack, ['tracks'], updater, { onSuccess });
};

const useEditTrack = () => {
  const queryClient = useQueryClient();
  const updater = (oldData: Track[] | undefined, newItem: EditTrack): Track[] => {
    return oldData?.map((track) => (track.id === newItem.id ? { ...track, ...newItem } : track)) || [];
  };

  const onSuccess = (data: SessionTrack | null) => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    data && sendNotification({ status: 'INFO', message: `Updated ${data.name} track` });
  };
  return useOptimisticMutation(Api.editTrack, ['tracks'], updater, { onSuccess });
};

const useRemoveTrack = () => {
  const queryClient = useQueryClient();
  const updater = (oldData: Track[] | undefined, id: SessionTrack['id']): Track[] => {
    return oldData?.filter((track) => track.id !== id) || [];
  };

  const onSuccess = (_data: SessionTrack | null, trackId: string, oldData: any) => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });

    const removedItem = oldData.find((t: Session) => t.id === trackId);
    removedItem && sendNotification({ status: 'SUCCESS', message: `Removed ${removedItem.name} track` });
  };
  return useOptimisticMutation(Api.deleteTrack, ['tracks'], updater, { onSuccess });
};
