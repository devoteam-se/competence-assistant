import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export default (_: Request, res: Response, next: NextFunction) => {
  res.locals.reqId = randomUUID();
  res.setHeader('X-Request-Id', res.locals.reqId);
  next();
};
