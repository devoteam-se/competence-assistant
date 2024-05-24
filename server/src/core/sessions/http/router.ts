import express from 'express';
import { ISessionService } from '../domain';

import sessionController from './controller';

const sessionsRouter = (sessionService: ISessionService) => {
  const router = express.Router();

  router.delete('/vote', sessionController.deleteVote(sessionService));
  router.delete('/favourite', sessionController.deleteFavourite(sessionService));
  router.delete('/:id', sessionController.deleteSession(sessionService));

  router.get('/', sessionController.getSessions(sessionService));
  // router.get('/mine', sessionController.getHostedSessions(sessionService));
  // router.get('/voted', sessionController.getVotedSessions(sessionService));
  router.get('/:id', sessionController.getSession(sessionService));

  router.post('/:id/copy', sessionController.copySession(sessionService));
  router.post('/', sessionController.createSession(sessionService));
  router.post('/favourite', sessionController.createFavourite(sessionService));
  router.post('/vote', sessionController.createVote(sessionService));

  router.put('/:id', sessionController.editSession(sessionService));
  router.put('/:id/links', sessionController.editLinks(sessionService));

  return router;
};

export default sessionsRouter;
