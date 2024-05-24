import { EditLinksValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
      const editLinks = EditLinksValidator.parse({ ...req.body, sessionId: req.params.id });

      const vote = await sessionService.editLinks(editLinks);

      respond(res, vote);

  };
};
