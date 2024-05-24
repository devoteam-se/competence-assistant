import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ISessionService } from '../../domain';
import { PagingValidator, SessionFilterValidator, SessionOrderValidator } from '@competence-assistant/shared';

export default (sessionService: ISessionService) => {
  return async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const filter = SessionFilterValidator.parse({
      tracks: req.query.tracks && String(req.query.tracks).split(','),
      events: req.query.events && String(req.query.events).split(','),
      types: req.query.types && String(req.query.types).split(','),
      levels: req.query.levels && String(req.query.levels).split(','),
      favouritedBy: req.query.favouritedBy,
      votedBy: req.query.votedBy,
      hostedBy: req.query.hostedBy,
      votable: req.query.votable === 'true',
    });

    const paging = PagingValidator.parse({
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
    });

    const orderBy = SessionOrderValidator.parse(req.query.orderBy);

    const page = await sessionService.getSessions(filter, paging, orderBy, userId);

    respond(res, page);
  };
};
