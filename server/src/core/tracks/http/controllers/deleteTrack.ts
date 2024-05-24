import { DeleteTrackValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ITracksService } from '../../domain';

export default (tracksService: ITracksService) => {
  return async (req: Request, res: Response) => {
    const deleteTrack = DeleteTrackValidator.parse({ id: req.params.id });

    await tracksService.deleteTrack(deleteTrack.id);

    respond(res, null, 204);
  };
};
