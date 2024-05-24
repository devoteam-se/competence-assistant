import { RoomIdValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IScheduleService } from '../../domain';

export default (scheduleService: IScheduleService) => {
  return async (req: Request, res: Response) => {
    const roomId = RoomIdValidator.parse(req.params.id);

    await scheduleService.deleteScheduleRoom(roomId);

    respond(res, null, 204);
  };
};
