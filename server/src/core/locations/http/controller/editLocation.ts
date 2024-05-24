import { EditLocationValidator } from '@competence-assistant/shared';
import { Request, Response } from 'express';

import { respond } from '../../../../pkg/web/respond';
import { ILocationService } from '../../domain';

export default (locationService: ILocationService) => {
  return async (req: Request, res: Response) => {
      const editLocation = EditLocationValidator.parse({ ...req.body, id: req.params.id });

      await locationService.editLocation(editLocation);

      respond(res, editLocation);

  };
};
