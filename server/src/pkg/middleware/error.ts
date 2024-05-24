import type { NextFunction, Request, Response } from 'express';
import { StatusError } from '../error';
import { ZodError } from 'zod';

function isStatusError(err: unknown): err is StatusError {
  return err instanceof StatusError || (err instanceof Error && Object.hasOwn(err, 'status'));
}

function isValidationError(error: unknown): error is ZodError {
  return error instanceof ZodError || (error instanceof Error && error.name === 'ZodError');
}

function format(err: Error) {
  if (isValidationError(err)) {
    return {
      message: 'Validation error',
      status: 422,
      cause: { issues: err.issues },
    };
  }
  if (isStatusError(err)) {
    return {
      message: err.message,
      status: err.status,
      cause: err.cause,
    };
  }

  return {
    message: 'internal error',
    status: 500,
  };
}

export function error(err: Error, _: Request, res: Response, next: NextFunction) {
  res.locals.err = err;
  const { status, message, cause } = format(err);

  res.status(status).json({ message, cause });

  next();
}
