import express from 'express';
import { ITracksService } from '../domain';
import requireAdmin from '../../../pkg/middleware/requireAdmin';

import tracksController from './controllers';

const tracksRouter = (tracksService: ITracksService) => {
  const router = express.Router();

  router.post('/', requireAdmin(), tracksController.createTrack(tracksService));
  router.get('/', tracksController.getTracks(tracksService));
  router.put('/:id', requireAdmin(), tracksController.editTrack(tracksService));
  router.delete('/:id', requireAdmin(), tracksController.deleteTrack(tracksService));

  return router;
};

export default tracksRouter;
