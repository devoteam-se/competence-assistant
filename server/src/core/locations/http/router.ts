import express from 'express';
import { ILocationService } from '../domain';

import locationController from './controller';

const locationsRouter = (locationService: ILocationService) => {
  const router = express.Router();

  router.get('/', locationController.getLocations(locationService));
  router.post('/', locationController.createLocation(locationService));
  router.put('/:id', locationController.editLocation(locationService));
  router.delete('/:id', locationController.deleteLocation(locationService));

  return router;
};

export default locationsRouter;
