import { EditScheduleSessionValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const editScheduleSession = EditScheduleSessionValidator.parse({
        ...req.body,
        sessionId: req.params.id,
        eventId: req.params.eventId,
      });

      const scheduleSession = await scheduleService.editScheduleSession(editScheduleSession);

      respond(res, scheduleSession);

  };
};
