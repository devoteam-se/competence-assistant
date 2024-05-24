import { NextFunction, Request, Response } from 'express';

import { Unauthorized } from '../error';

export default () => {
  return (_: Request, res: Response, next: NextFunction) => {
    if (!res.locals?.user?.admin) throw new Unauthorized('user is not admin');

    next();
  };
};
