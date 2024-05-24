import { DeleteWishValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { IWishesService } from '../../domain';

export default (wishesService: IWishesService) => {
  return async (req: Request, res: Response) => {
      const wish = DeleteWishValidator.parse({ id: req.params.id });

      await wishesService.deleteWish(wish.id, res.locals.user.id);

      respond(res, null, 204);

  };
};
