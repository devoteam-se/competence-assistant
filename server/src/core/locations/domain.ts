import { Location, NewLocation, EditLocation } from '@competence-assistant/shared';

export interface ILocationsRepo {
  createLocation(location: NewLocation): Promise<Location>;
  getLocations(): Promise<Location[]>;
  editLocation(location: EditLocation): Promise<Location>
  deleteLocation(id: Location['id']): Promise<void>;
}

export interface ILocationService {
  createLocation(location: NewLocation): Promise<Location>
  getLocations(): Promise<Location[]>;
  editLocation(location: EditLocation): Promise<Location>
  deleteLocation(id: Location['id']): Promise<void>;
}
