import { NewSessionValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
      const newSession = NewSessionValidator.parse(req.body);

      const session = await sessionService.createSession(newSession, res.locals.user.id);

      respond(res, session, 201);

  };
};
