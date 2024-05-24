import { NewTrackValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ITracksService } from '../../domain';

export default (tracksService: ITracksService) => {
  return async (req: Request, res: Response) => {
    const newTrack = NewTrackValidator.parse(req.body);

    const tracks = await tracksService.createTrack(newTrack);

    respond(res, tracks, 201);
  };
};
