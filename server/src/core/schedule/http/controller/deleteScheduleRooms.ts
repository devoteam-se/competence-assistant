import { DeleteMultipleRoomsValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
      const roomIds = DeleteMultipleRoomsValidator.parse(req.body);

      await scheduleService.deleteScheduleRooms(roomIds);

      respond(res, null, 204);

  };
};
