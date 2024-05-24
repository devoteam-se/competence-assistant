import express from 'express';
import { IWishesService } from '../domain';

import wishesController from './controllers';

const wishesRouter = (wishesService: IWishesService) => {
  const router = express.Router();

  router.get('/', wishesController.getWishes(wishesService));
  router.post('/', wishesController.createWish(wishesService));
  router.put('/:id', wishesController.editWish(wishesService));
  router.delete('/:id', wishesController.deleteWish(wishesService));

  return router;
};

export default wishesRouter;
