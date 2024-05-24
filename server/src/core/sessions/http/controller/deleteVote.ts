import { VoteValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
    const oldVote = VoteValidator.parse({
      sessionId: req.body.sessionId,
      userId: res.locals.user.id,
      eventId: req.body.eventId,
    });

    await sessionService.deleteVote(oldVote);

    respond(res, null, 204);
  };
};
