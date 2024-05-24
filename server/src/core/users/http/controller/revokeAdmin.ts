import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IUserService } from '../../domain';

export default (userService: IUserService) => {
  return async (req: Request, res: Response) => {
      await userService.revokeAdmin(req.params.id);

      respond(res, null, 204);

  };
};
