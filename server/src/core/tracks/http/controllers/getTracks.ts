import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ITracksService } from '../../domain';

export default (tracksService: ITracksService) => {
  return async (_: Request, res: Response) => {
    const tracks = await tracksService.getTracks();
    respond(res, tracks);
  };
};
