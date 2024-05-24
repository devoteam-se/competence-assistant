import { EditSessionValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
      const editSession = EditSessionValidator.parse({ ...req.body, id: req.params.id });

      const session = await sessionService.editSession(editSession, res.locals.user.id);

      respond(res, session);

  };
};
