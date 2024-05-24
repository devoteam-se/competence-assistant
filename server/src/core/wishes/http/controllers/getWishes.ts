import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IWishesService } from '../../domain';

export default (wishesService: IWishesService) => {
  return async (_: Request, res: Response) => {
    const wishes = await wishesService.getWishes();
    respond(res, wishes);
  };
};
