import { z } from 'zod';
import { NewRoomValidator, RoomValidator } from '../validators';

export type Room = z.infer<typeof RoomValidator>;
export type NewRoom = z.infer<typeof NewRoomValidator>;
