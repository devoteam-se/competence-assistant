import { BreakIdValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const id = BreakIdValidator.parse(req.params.id);

      await scheduleService.deleteScheduleBreak(id);

      respond(res, null, 204);

  };
};
