import { EditWishValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IWishesService } from '../../domain';

export default (wishesService: IWishesService) => {
  return async (req: Request, res: Response) => {
    const editWish = EditWishValidator.parse({ ...req.body, id: req.params.id });

    const wish = await wishesService.editWish(editWish, res.locals.user.id);

    respond(res, wish);
  };
};
