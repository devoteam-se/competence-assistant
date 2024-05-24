import { Location } from '@competence-assistant/shared';
import { ILocationService, ILocationsRepo } from '../domain';

export default class LocationService implements ILocationService {
  constructor(private locationRepo: ILocationsRepo) {}

  async createLocation(location: { name: string; rooms: string[]; }): Promise<Location> {
    return this.locationRepo.createLocation(location);
  }

  async getLocations(): Promise<Location[]> {
    return this.locationRepo.getLocations();
  }

  async editLocation(location: Location): Promise<Location> {
    return this.locationRepo.editLocation(location);
  }

  async deleteLocation(id: Location['id']): Promise<void> {
    return this.locationRepo.deleteLocation(id);
  }

}
