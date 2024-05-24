import { NewScheduleSessionValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const newScheduleSession = NewScheduleSessionValidator.parse({
        sessionId: req.body.sessionId,
        roomId: req.body.roomId,
        eventId: req.params.eventId,
        start: req.body.start,
        end: req.body.end,
      });

      const scheduleRoom = await scheduleService.createScheduleSession(newScheduleSession);

      respond(res, scheduleRoom, 201);

  };
};
