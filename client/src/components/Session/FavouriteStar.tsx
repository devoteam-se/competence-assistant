import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { useFavourites } from '@/hooks/favourites';
import { useAuth } from '@/contexts/auth';
import IconButton from '../IconButton';

type Props = {
  sessionId: string;
  isFavourite?: boolean | null;
};

const FavouriteStar = ({ isFavourite = false, sessionId }: Props) => {
  const { addFavourite, removeFavourite } = useFavourites();
  const { currentUser } = useAuth();

  const toggle = () => {
    if (!currentUser) return;
    isFavourite ? removeFavourite({ sessionId }) : addFavourite({ sessionId });
  };

  return (
    <IconButton color={isFavourite ? 'yellow' : 'dark'} onClick={toggle}>
      {isFavourite ? <IconStarFilled /> : <IconStar />}
    </IconButton>
  );
};

export default FavouriteStar;
