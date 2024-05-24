import { z } from 'zod';
import { WishValidator, NewWishValidator, EditWishValidator } from '../validators';

export type Wish = z.infer<typeof WishValidator>;
export type NewWish = z.infer<typeof NewWishValidator>;
export type EditWish = z.infer<typeof EditWishValidator>;
