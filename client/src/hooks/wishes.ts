import Api from '@/api';
import { Wish, NewWish, EditWish } from '@competence-assistant/shared';
import { sendNotification } from '@/utils/notifications';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOptimisticMutation } from './optimisticMutation';
import { useTranslation } from 'react-i18next';

export const useWishes = () => {
  const wishes = useQuery({ queryKey: ['wishes'], queryFn: Api.getWishes, staleTime: Infinity });
  const { mutate: createWish } = useCreateWish();
  const { mutate: editWish } = useEditWish();
  const { mutate: removeWish } = useRemoveWish();

  return { wishes, createWish, editWish, removeWish };
};

const useCreateWish = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('wish', { keyPrefix: 'notifications' });

  const updater = (oldData: Wish[] | undefined, newWish: NewWish): Wish[] => [
    ...(oldData || []),
    { ...newWish, id: 'tmp', createdAt: '', updatedAt: '', userId: '' },
  ];

  const onSuccess = (data: Wish) => {
    queryClient.invalidateQueries({ queryKey: ['wishes'] });
    sendNotification({ status: 'SUCCESS', message: t('added', { name: data.name }) });
  };

  return useOptimisticMutation(Api.createWish, ['wishes'], updater, { onSuccess });
};

const useEditWish = () => {
  const { t } = useTranslation('wish', { keyPrefix: 'notifications' });

  const updater = (oldData: Wish[] | undefined, newItem: EditWish): Wish[] => {
    return oldData?.map((wish) => (wish.id === newItem.id ? { ...wish, ...newItem } : wish)) || [];
  };

  const onSuccess = (data: Wish | null) => {
    data && sendNotification({ status: 'INFO', message: t('updated', { name: data.name }) });
  };

  return useOptimisticMutation(Api.editWish, ['wishes'], updater, { onSuccess });
};

const useRemoveWish = () => {
  const { t } = useTranslation('wish', { keyPrefix: 'notifications' });

  const updater = (oldData: Wish[] | undefined, id: Wish['id']): Wish[] => {
    return oldData?.filter((wish) => wish.id !== id) || [];
  };

  const onSuccess = (_data: Wish | null, wishId: string, oldData: any) => {
    const removed = oldData.find((wish: Wish) => wish.id === wishId);
    removed && sendNotification({ status: 'SUCCESS', message: t('deleted', { name: removed.name }) });
  };
  return useOptimisticMutation(Api.deleteWish, ['wishes'], updater, { onSuccess });
};
