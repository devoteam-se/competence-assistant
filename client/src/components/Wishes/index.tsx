import { useWishes } from '@/hooks/wishes';

import WishCard from './WishCard';
import { useTranslation } from 'react-i18next';
import CardGrid from '../CardGrid';

const WishesGrid = () => {
  const { t } = useTranslation('wish', { keyPrefix: 'grid' });
  const { wishes } = useWishes();

  return (
    <CardGrid isLoading={wishes.isLoading} emptyText={t('empty')}>
      {wishes.data?.map((wish) => <WishCard key={wish.id} data={wish} />)}
    </CardGrid>
  );
};

export default WishesGrid;
