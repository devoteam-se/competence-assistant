import express from 'express';

import requireAdmin from '../../../pkg/middleware/requireAdmin';
import { IScheduleService } from '../domain';
import scheduleController from './controller';

const scheduleRouter = (scheduleService: IScheduleService) => {
  const router = express.Router({ mergeParams: true });

  router.get('/', scheduleController.getSchedule(scheduleService));
  router.post('/rooms', requireAdmin(), scheduleController.createScheduleRoom(scheduleService));
  router.delete('/rooms', requireAdmin(), scheduleController.deleteScheduleRooms(scheduleService));
  router.delete('/rooms/:id', requireAdmin(), scheduleController.deleteScheduleRoom(scheduleService));
  router.post('/sessions', requireAdmin(), scheduleController.createScheduleSession(scheduleService));
  router.put('/sessions/:id', requireAdmin(), scheduleController.editScheduleSession(scheduleService));
  router.delete('/sessions/:id', requireAdmin(), scheduleController.deleteScheduleSession(scheduleService));
  router.post('/breaks', requireAdmin(), scheduleController.createScheduleBreak(scheduleService));
  router.put('/breaks/:id', requireAdmin(), scheduleController.editScheduleBreak(scheduleService));
  router.delete('/breaks/:id', requireAdmin(), scheduleController.deleteScheduleBreak(scheduleService));

  return router;
};

export default scheduleRouter;
