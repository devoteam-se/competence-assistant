import { NextFunction, Request, Response } from 'express';
import { performance } from 'perf_hooks';
import { Logger } from 'pino';

export default (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now();
    next();

    res.on('finish', () => {
      const stop = performance.now();
      const duration = stop - start;

      const statusCode = res.statusCode;

      const logBody = {
        status: statusCode,
        method: req.method,
        path: req.originalUrl,
        duration: Number(duration).toFixed(0),
        reqId: res.locals.reqId,
        err: res.locals.err,
      };
      const child = logger.child(logBody);

      if (statusCode < 400) {
        child.info('request handled');
      } else if (statusCode < 500) {
        child.warn('request handled');
      } else {
        child.error('request handled');
      }
    });
  };
};
