import { Request, Response } from 'express';
import { BadRequest } from '../../../../pkg/error';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
    const sessionId = req.body.sessionId;
    const userId = res.locals.user.id;

    if (!sessionId || !userId) {
      throw new BadRequest('missing sessionId or userId');
    }

    await sessionService.createFavourite(userId, sessionId);

    respond(res, {});
  };
};
