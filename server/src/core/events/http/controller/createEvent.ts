import { Request, Response } from 'express';
import { NewEventValidator } from '@competence-assistant/shared';

import { respond } from '../../../../pkg/web/respond';
import { IEventService } from '../../domain';

export default (eventService: IEventService) => {
  return async (req: Request, res: Response) => {
    const newEvent = NewEventValidator.parse(req.body);

    const events = await eventService.createEvent(newEvent);

    respond(res, events, 201);
  };
};
