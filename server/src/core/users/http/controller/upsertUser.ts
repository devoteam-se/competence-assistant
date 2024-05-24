import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IUserService } from '../../domain';

export default (userService: IUserService) => {
  return async (_: Request, res: Response) => {
      await userService.upsertUser(res.locals.user);

      respond(res, null, 204);

  };
};
