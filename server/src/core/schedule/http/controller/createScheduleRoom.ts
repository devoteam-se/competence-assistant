import { NewRoomValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';
import { z } from 'zod';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const body = req.body;

      if (Array.isArray(body)) {
        const rooms = z
          .array(z.object({ name: z.string().min(1) }))
          .nonempty()
          .parse(req.body);

        const eventId = z.string().uuid().parse(req.params.eventId);

        const newRooms = rooms.map((room) => ({
          name: room.name,
          eventId: eventId,
        }));

        const scheduleRoom = await scheduleService.createScheduleRooms(newRooms);

        return respond(res, scheduleRoom, 200);
      }

      const newRoom = NewRoomValidator.parse({ name: body.name, eventId: req.params.eventId });

      const scheduleRoom = await scheduleService.createScheduleRoom(newRoom);

      respond(res, scheduleRoom, 201);

  };
};
