import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';

import { mkSessionService } from '../../mocks/SessionService';
import deleteVoteHandler from '../controller/deleteVote';

describe('deleteVote', () => {
  const sessionService = mkSessionService;
  const handler = deleteVoteHandler(sessionService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('happy', async () => {
    const body = {
      sessionId: 'a32eb30c-3f22-11ed-b878-0242ac120002',
      eventId: 'a32eb30c-3f22-11ed-b878-0242ac120002',
    };

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/sessions/vote', body });
    const res = httpMocks.createResponse<Response>();
    res.locals = { ...res.locals, user: { id: 'a32eb30c-3f22-11ed-b878-0242ac120002' } };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(204);
    expect(sessionService.deleteVote).toHaveBeenCalledWith({
      ...body,
      userId: res.locals.user.id,
    });
    expect(res._getData()).toBe('');
  });

  test('session id is not a uuid', async () => {
    const body = {
      sessionId: 'a32eb30c',
    };

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/sessions/vote', body });
    const res = httpMocks.createResponse<Response>();
    res.locals = { ...res.locals, user: { id: 'a32eb30c-3f22-11ed-b878-0242ac120002' } };

    const promise = handler(req, res);

    await expect(promise).rejects.toThrow();
    expect(sessionService.deleteVote).not.toHaveBeenCalled();
  });

  test('session id is undefined', async () => {
    const body = {};

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/sessions/vote', body });
    const res = httpMocks.createResponse<Response>();
    res.locals = { ...res.locals, user: { id: 'a32eb30c-3f22-11ed-b878-0242ac120002' } };

    const promise = handler(req, res);

    await expect(promise).rejects.toThrow();
    expect(sessionService.deleteVote).not.toHaveBeenCalled();
  });
});
