import { NewWishValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IWishesService } from '../../domain';

export default (wishesService: IWishesService) => {
  return async (req: Request, res: Response) => {
    const newWish = NewWishValidator.parse(req.body);

    const wishes = await wishesService.createWish(newWish, res.locals.user.id);

    respond(res, wishes, 201);
  };
};
