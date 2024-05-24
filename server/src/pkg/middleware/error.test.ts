import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';

import StatusError from '../error/StatusError';
import { error } from './error';
import { z } from 'zod';
import { BadRequest, Forbidden, NotFound, Unauthorized, Upstream } from '../error';

describe('error middleware', () => {
  const next = jest.fn();
  it('should extract status and message from status error', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new StatusError('error', 501);

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(501);
    expect(res._getJSONData()).toStrictEqual({ message: 'error' });
  });

  it('should return 500 status for non status error', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new Error('error');

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({ message: 'internal error' });
  });

  it('Should handle ValidationError', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const s = z.string().min(5);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const err = s.safeParse('123').error!;

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(422);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Validation error',
      cause: {
        issues: [
          {
            code: 'too_small',
            exact: false,
            inclusive: true,
            message: 'String must contain at least 5 character(s)',
            minimum: 5,
            path: [],
            type: 'string',
          },
        ],
      },
    });
  });

  it('Should handle NotFound', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new NotFound();

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({ message: 'Not found' });
  });

  it('Should handle unauthorized', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new Unauthorized();

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual({ message: 'Unauthorized' });
  });

  it('Should handle Forbidden', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new Forbidden();

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toStrictEqual({ message: 'Forbidden' });
  });

  it('Should handle bad request', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new BadRequest();

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({ message: 'Bad request' });
  });

  it('Should handle UpstreamError', () => {
    // given
    const req = httpMocks.createRequest<Request>();
    const res = httpMocks.createResponse<Response>();
    const err = new Upstream(new Error('Upstream error'));

    // when
    error(err, req, res, next);

    // then
    expect(res.statusCode).toBe(501);
    expect(res._getJSONData()).toStrictEqual({ message: 'Upstream error', cause: {} });
  });
});
