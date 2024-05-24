import 'express-async-errors';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { Logger } from 'pino';

import eventsRouter from '../core/events/http/router';
import EventRepo from '../core/events/repo/postgres';
import EventService from '../core/events/service/service';
import ScheduleRepo from '../core/schedule/repo/postgres';
import ScheduleService from '../core/schedule/service/service';
import sessionsRouter from '../core/sessions/http/router';
import SessionRepo from '../core/sessions/repo/postgres';
import SessionService from '../core/sessions/service/service';
import tracksRouter from '../core/tracks/http/router';
import TracksRepo from '../core/tracks/repo/postgres';
import TracksService from '../core/tracks/service/service';
import usersRouter from '../core/users/http/router';
import UserRepo from '../core/users/repo/postgres';
import UserService from '../core/users/service/service';
import locationsRouter from '../core/locations/http/router';
import LocationsService from '../core/locations/service/service';
import wishesRouter from '../core/wishes/http/router';
import WishesRepo from '../core/wishes/repo/postgres';
import WishesService from '../core/wishes/service/service';
import { createDbConn } from '../pkg/db/postgres';
import AuthService from '../pkg/auth/firebase';
import Transaction from '../pkg/db/transaction';
import auth from '../pkg/middleware/auth';
import log from '../pkg/middleware/logger';
import requestId from '../pkg/middleware/requestId';
import { error } from '../pkg/middleware/error';
import type { Config } from './config';
import LocationsRepo from '../core/locations/repo/postgres';

const CLIENT_DIR = path.resolve(__dirname, '..', '..', '..', 'client');

export const configureServer = async (logger: Logger, config: Config) => {
  // Setup db connection
  const pool = await createDbConn(config.postgres, logger);

  // Setup repositories
  const eventRepo = new EventRepo(pool);
  const sessionRepo = new SessionRepo(pool);
  const userRepo = new UserRepo(pool);
  const transaction = new Transaction(pool);
  const tracksRepo = new TracksRepo(pool);
  const wishesRepo = new WishesRepo(pool);
  const scheduleRepo = new ScheduleRepo(pool);
  const locationsRepo = new LocationsRepo(pool);

  // Setup services
  const authService = new AuthService();
  const sessionService = new SessionService(sessionRepo, eventRepo, transaction, authService);
  const eventService = new EventService(eventRepo, sessionRepo, transaction);
  const userService = new UserService(userRepo, authService);
  const tracksService = new TracksService(tracksRepo);
  const scheduleService = new ScheduleService(scheduleRepo);
  const locationsService = new LocationsService(locationsRepo);
  const wishesService = new WishesService(wishesRepo, authService);

  // Initialize express app
  const app = express();

  app.get('/health', (_, res) => res.send("I'm healthy!"));

  // Global middlewares
  app.use(cors({ origin: true }));
  app.use(compression());
  app.use(requestId);
  app.use(log(logger));

  // Mount api sub routers
  const apiRouter = express.Router();

  apiRouter.use(auth(authService));
  apiRouter.use(express.json());

  apiRouter.use('/events', eventsRouter(eventService, scheduleService));
  apiRouter.use('/sessions', sessionsRouter(sessionService));
  apiRouter.use('/users', usersRouter(userService));
  apiRouter.use('/tracks', tracksRouter(tracksService));
  apiRouter.use('/locations', locationsRouter(locationsService));
  apiRouter.use('/wishes', wishesRouter(wishesService));

  // Mount api router
  app.use('/api', apiRouter);

  if (!config.development) {
    // Serve static files
    app.use(express.static(path.resolve(CLIENT_DIR, 'dist')));

    // Serve frontend
    app.get('*', (_, res) => {
      res.sendFile(path.resolve(CLIENT_DIR, 'dist', 'index.html'));
    });
  }

  app.use(error);

  return app;
};
