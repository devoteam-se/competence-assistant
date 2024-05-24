import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';

import { mkEventService } from '../../mocks/EventService';
import createEventHandler from './createEvent';

describe('createEvent', () => {
  const eventService = mkEventService;
  const handler = createEventHandler(eventService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('happy', async () => {
    const body = {
      name: 'K-day',
      startDate: '2022-10-15T13:11:04Z',
      endDate: '2022-10-16T13:11:04Z',
      votingEndDate: '2022-10-15T13:11:04Z',
    };

    const json = {
      id: 'id',
      name: 'K-day',
      active: false,
      startDate: '2022-10-15T13:11:04Z',
      endDate: '2022-10-16T13:11:04Z',
      votingEndDate: '2022-10-15T13:11:04Z',
      createdAt: '2022-10-15T13:11:04Z',
      updatedAt: '2022-10-15T13:11:04Z',
    };

    eventService.createEvent.mockResolvedValue(json);

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/events', body });
    const res = httpMocks.createResponse<Response>();

    await handler(req, res);

    expect(eventService.createEvent).toHaveBeenCalledWith(body);
    expect(res._getJSONData()).toStrictEqual(json);
  });

  test('startDate undefined', async () => {
    const body = {
      name: 'K-day',
      endDate: '2022-10-16T13:11:04Z',
      votingEndDate: '2022-10-15T13:11:04Z',
    };

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/events', body });
    const res = httpMocks.createResponse<Response>();

    const promise = handler(req, res);

    await expect(promise).rejects.toThrow();
    expect(eventService.createEvent).not.toHaveBeenCalled();
  });

  test('endDate undefined', async () => {
    const body = {
      name: 'K-day',
      startDate: '2022-10-15T13:11:04Z',
      votingEndDate: '2022-10-15T13:11:04Z',
    };

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/events', body });
    const res = httpMocks.createResponse<Response>();

    const promise = handler(req, res);

    await expect(promise).rejects.toThrow();
    expect(eventService.createEvent).not.toHaveBeenCalled();
  });

  test('votingEndDate undefined', async () => {
    const body = {
      name: 'K-day',
      startDate: '2022-10-15T13:11:04Z',
      endDate: '2022-10-16T13:11:04Z',
    };

    const req = httpMocks.createRequest<Request>({ method: 'POST', url: '/events', body });
    const res = httpMocks.createResponse<Response>();

    const promise = handler(req, res);

    await expect(promise).rejects.toThrow();
    expect(eventService.createEvent).not.toHaveBeenCalled();
  });
});
