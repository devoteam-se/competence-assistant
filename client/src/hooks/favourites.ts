import Api from '../api';
import { useOptimisticMutation } from './optimisticMutation';
import { sendNotification } from '../utils/notifications';
import { useTranslation } from 'react-i18next';

export const useFavourites = () => {
  const { mutate: addFavourite } = useAddFavourite();
  const { mutate: removeFavourite } = useRemoveFavourite();

  return { addFavourite, removeFavourite };
};

// TODO: Why are we using optimistic updates here if we're not updating the cache?
const useAddFavourite = () => {
  const { t } = useTranslation('session', { keyPrefix: 'favourite' });
  const favouriteUpdater = () => {
    return;
  };

  const onSuccess = () => {
    sendNotification({ status: 'INFO', message: t('added') });
  };

  return useOptimisticMutation(Api.addFavourite, ['sessions'], favouriteUpdater, { onSuccess });
};

const useRemoveFavourite = () => {
  const { t } = useTranslation('session', { keyPrefix: 'favourite' });

  const favouriteUpdater = () => {
    return;
  };

  const onSuccess = () => {
    sendNotification({ status: 'INFO', message: t('removed') });
  };

  return useOptimisticMutation(Api.removeFavourite, ['sessions'], favouriteUpdater, { onSuccess });
};
