import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IUserService } from '../../domain';

export default (userService: IUserService) => {
  return async (_: Request, res: Response) => {
      const users = await userService.getUsers();

      respond(res, users);

  };
};
