import { EditBreakValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const editScheduleBreak = EditBreakValidator.parse({
        ...req.body,
        eventId: req.params.eventId,
        id: req.params.id,
      });

      const scheduleBreak = await scheduleService.editScheduleBreak(editScheduleBreak);

      respond(res, scheduleBreak);

  };
};
