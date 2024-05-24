import { Location, NewLocation, EditLocation } from '@competence-assistant/shared';
import { get, post, put, _delete } from './method';

export default {
  createLocation: async (newLocation: NewLocation) => {
    return post<Location, NewLocation>(`locations`, newLocation);
  },
  getLocations: async () => {
    return get<Location[]>(`locations`);
  },
  editLocation: async (editLocation: EditLocation) => {
    return put<Location, EditLocation>(`locations/${editLocation.id}`, editLocation);
  },
  deleteLocation: async (id: Location['id']) => {
    return _delete<null, undefined>(`locations/${id}`);
  },
};
