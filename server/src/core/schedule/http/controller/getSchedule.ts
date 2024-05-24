import { EventIdValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const eventId = EventIdValidator.parse(req.params.eventId);

      const schedule = await scheduleService.getSchedule(eventId);

      respond(res, schedule);

  };
};
