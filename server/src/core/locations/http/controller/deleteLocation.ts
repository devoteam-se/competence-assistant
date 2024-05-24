import { DeleteLocationValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ILocationService } from '../../domain';

export default (locationService: ILocationService) => {
  return async (req: Request, res: Response) => {
      const location = DeleteLocationValidator.parse({ id: req.params.id });

      await locationService.deleteLocation(location.id);

      respond(res, null, 204);

  };
};
