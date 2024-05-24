import { ISessionService } from '../../domain';
import { Request, Response } from 'express';
import { respond } from '../../../../pkg/web/respond';
import { BadRequest } from '../../../../pkg/error';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const userId = res.locals.user.id;

    if (!sessionId || !userId) {
      throw new BadRequest('missing sessionId or userId');
    }

    const session = await sessionService.copySession(sessionId, userId);
    respond(res, session);
  };
};
