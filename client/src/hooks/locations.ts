import Api from '@/api';
import { sendNotification } from '@/utils/notifications';
import { NewLocation, Location, EditLocation } from '@competence-assistant/shared';
import { useQuery } from '@tanstack/react-query';
import { useOptimisticMutation } from './optimisticMutation';

export const useLocations = () => {
  return useQuery({ queryKey: ['locations'], queryFn: Api.getLocations, staleTime: Infinity });
};

export const useLocationMutations = () => {
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: editLocation } = useEditLocation();
  const { mutate: removeLocation } = useRemoveLocation();

  return { createLocation, editLocation, removeLocation };
};

const useCreateLocation = () => {
  const updater = (oldData: Location[] | undefined, newLocation: NewLocation): Location[] => [
    ...(oldData || []),
    {
      ...newLocation,
      id: 'tmp',
      createdAt: '',
      updatedAt: '',
    },
  ];

  const onSuccess = (data: Location) => {
    sendNotification({ status: 'SUCCESS', message: `Created ${data.name} location` });
  };

  return useOptimisticMutation(Api.createLocation, ['locations'], updater, { onSuccess });
};

const useEditLocation = () => {
  const updater = (oldData: Location[] | undefined, newItem: EditLocation): Location[] => {
    return oldData?.map((location) => (location.id === newItem.id ? { ...location, ...newItem } : location)) || [];
  };

  const onSuccess = (data: Location | null) => {
    data && sendNotification({ status: 'INFO', message: `Updated ${data.name} location` });
  };

  return useOptimisticMutation(Api.editLocation, ['locations'], updater, { onSuccess });
};

const useRemoveLocation = () => {
  const updater = (oldData: Location[] | undefined, id: Location['id']): Location[] => {
    return oldData?.filter((location) => location.id !== id) || [];
  };

  const onSuccess = (_data: Location | null, locationId: string, oldData: any) => {
    const removedItem = oldData.find((location: Location) => location.id === locationId);
    removedItem && sendNotification({ status: 'SUCCESS', message: `Removed ${removedItem.name} location` });
  };
  return useOptimisticMutation(Api.deleteLocation, ['locations'], updater, { onSuccess });
};
