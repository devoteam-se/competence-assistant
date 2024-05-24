import express from 'express';

import requireAdmin from '../../../pkg/middleware/requireAdmin';
import { IScheduleService } from '../../schedule/domain';
import scheduleRouter from '../../schedule/http/router';
import { IEventService } from '../domain';
import eventController from './controller';

const eventsRouter = (eventService: IEventService, scheduleService: IScheduleService) => {
  const router = express.Router();

  router.get('/', eventController.getEvents(eventService));
  router.get('/:id', eventController.getEvent(eventService));
  router.post('/', requireAdmin(), eventController.createEvent(eventService));
  router.put('/:id', requireAdmin(), eventController.editEvent(eventService));
  router.put('/:id/activate', requireAdmin(), eventController.activateEvent(eventService));
  router.put('/:id/deactivate', requireAdmin(), eventController.deactivateEvent(eventService));
  router.delete('/:id', requireAdmin(), eventController.deleteEvent(eventService));

  router.use('/:eventId/schedule', scheduleRouter(scheduleService));

  return router;
};

export default eventsRouter;
