import { EditTrackValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ITracksService } from '../../domain';

export default (tracksService: ITracksService) => {
  return async (req: Request, res: Response) => {
    const editTrack = EditTrackValidator.parse({ ...req.body, id: req.params.id });

    const track = await tracksService.editTrack(editTrack);

    respond(res, track);
  };
};
