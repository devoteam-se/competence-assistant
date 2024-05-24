import { EventIdValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IEventService } from '../../domain';

export default (eventService: IEventService) => {
  return async (req: Request, res: Response) => {
      const eventId = EventIdValidator.parse(req.params.id);

      const event = await eventService.deactivateEvent(eventId);

      respond(res, event);

  };
};
