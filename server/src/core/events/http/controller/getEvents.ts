import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IEventService } from '../../domain';
import { EventFilterValidator, EventOrderValidator, PagingValidator } from '@competence-assistant/shared';

export default (eventService: IEventService) => {
  return async (req: Request, res: Response) => {
    const filter = EventFilterValidator.parse({
      states: req.query.states && String(req.query.states).split(','),
    });

    const paging = PagingValidator.parse({
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
    });
    const order = EventOrderValidator.parse(req.query.order);

    const events = await eventService.getEvents(filter, paging, order);

    respond(res, events);
  };
};
