import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';
import { SessionIdValidator } from '@competence-assistant/shared';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
    const id = SessionIdValidator.parse(req.params.id);

    const session = await sessionService.getSession(id, res.locals.user.id);

    respond(res, session);
  };
};
