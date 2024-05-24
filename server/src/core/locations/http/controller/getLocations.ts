import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ILocationService } from '../../domain';

export default (locationService: ILocationService) => {
  return async (_: Request, res: Response) => {
      const locations = await locationService.getLocations();

      respond(res, locations);

  };
};
