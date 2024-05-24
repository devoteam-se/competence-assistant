import { DeleteScheduleSessionValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const deleteScheduleSession = DeleteScheduleSessionValidator.parse({
        sessionId: req.params.id,
        eventId: req.params.eventId,
      });

      await scheduleService.deleteScheduleSession(deleteScheduleSession);

      respond(res, null, 204);

  };
};
