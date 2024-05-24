import { z } from 'zod';

export const RoomIdValidator = z.string().uuid();

export const RoomValidator = z.object({
  id: RoomIdValidator,
  name: z.string().min(1),
  eventId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const NewRoomValidator = RoomValidator.pick({ eventId: true, name: true });

export const DeleteMultipleRoomsValidator = z.array(RoomIdValidator).nonempty();
