import { EditEventValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IEventService } from '../../domain';

export default (eventService: IEventService) => {
  return async (req: Request, res: Response) => {
      const editEvent = EditEventValidator.parse({ ...req.body, id: req.params.id });

      const events = await eventService.editEvent(editEvent);

      respond(res, events);

  };
};
