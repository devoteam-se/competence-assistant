import { SessionIdValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
      const sessionId = SessionIdValidator.parse(req.params.id);

      await sessionService.deleteSession(sessionId, res.locals.user.id);

      respond(res, null, 204);

  };
};
