import { NewLocationValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ILocationService } from '../../domain';

export default (locationService: ILocationService) => {
  return async (req: Request, res: Response) => {
      const newLocation = NewLocationValidator.parse(req.body);

      const location = await locationService.createLocation(newLocation);

      respond(res, location);

  };
};
