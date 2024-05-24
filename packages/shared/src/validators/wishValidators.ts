import { z } from 'zod';
import { SessionLevelEnum, SessionTypeEnum } from '../enums/sessionEnums';

export const WishValidator = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'You must provide a name' }),
  description: z.string().min(1, { message: 'You must provide a description' }),
  type: z.nullable(z.nativeEnum(SessionTypeEnum).or(z.literal(''))),
  level: z.nullable(z.nativeEnum(SessionLevelEnum).or(z.literal(''))),
  userId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const NewWishValidator = WishValidator.omit({ id: true, createdAt: true, updatedAt: true, userId: true });
export const EditWishValidator = WishValidator.omit({ createdAt: true, updatedAt: true, userId: true });
export const DeleteWishValidator = WishValidator.pick({ id: true });
