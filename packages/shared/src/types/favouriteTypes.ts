import { z } from 'zod';
import { FavouriteValidator } from '../validators';

export type Favourite = z.infer<typeof FavouriteValidator>;
