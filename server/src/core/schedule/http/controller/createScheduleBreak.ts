import { NewBreakValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const newScheduleBreak = NewBreakValidator.parse({ ...req.body, eventId: req.params.eventId });

      const scheduleBreak = await scheduleService.createScheduleBreak(newScheduleBreak);

      respond(res, scheduleBreak, 201);

  };
};
