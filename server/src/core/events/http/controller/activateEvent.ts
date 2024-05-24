import { Request, Response } from 'express';
import { z } from 'zod';

import { respond } from '../../../../pkg/web/respond';
import { IEventService } from '../../domain';

export const EventId = z.string().uuid();

export default (eventService: IEventService) => {
  return async (req: Request, res: Response) => {
    const eventId = EventId.parse(req.params.id);

    const event = await eventService.activateEvent(eventId);

    respond(res, event);
  };
};
