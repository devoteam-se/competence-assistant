import { Response } from 'express';

export const respond = (res: Response, body: unknown, status = 200) => {
  res.status(status).setHeader('Content-Type', typeof body === 'object' ? 'application/json' : 'text/html');

  if (!body) {
    return res.send();
  }

  res.json(body);
};
