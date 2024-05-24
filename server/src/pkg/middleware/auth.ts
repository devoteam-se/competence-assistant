import { NextFunction, Request, Response } from 'express';
import { Unauthorized } from '../error';
import AuthService from '../auth/firebase';

export default (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw new Unauthorized('Missing token');

    authService
      .verifyToken(token)
      .then((decoded) => {
        if (!decoded) throw new Unauthorized('Invalid token');

        res.locals.user = {
          id: decoded.user_id,
          email: decoded.email,
          name: decoded.name,
          photoUrl: decoded.picture || '',
          admin: decoded.admin || false,
        };
        return next();
      })
      .catch((err) => {
        throw new Unauthorized('Invalid token', err);
      });
  };
};
