import express from 'express';
import requireAdmin from '../../../pkg/middleware/requireAdmin';
import { IUserService } from '../domain';

import userController from './controller';

const usersRouter = (userService: IUserService) => {
  const router = express.Router();

  router.get('/', userController.getUsers(userService));
  router.put('/:id/grantAdmin', requireAdmin(), userController.grantAdmin(userService));
  router.put('/:id/revokeAdmin', requireAdmin(), userController.revokeAdmin(userService));
  router.put('/', userController.upsertUser(userService));

  return router;
};

export default usersRouter;
