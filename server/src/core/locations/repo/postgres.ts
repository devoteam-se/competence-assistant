import { Location } from '@competence-assistant/shared';
import { Sql } from 'postgres';
import { ILocationsRepo } from '../domain';
import crypto from 'crypto';

class LocationsRepo implements ILocationsRepo {
  constructor(private sql: Sql) {}

  async createLocation(location: Location): Promise<Location> {
    const locations = await this.sql<Location[]>`
      INSERT INTO location_rooms (
        id, 
        name,
        room_names
      )
      VALUES (
        ${crypto.randomUUID()},
        ${location.name},
        ${location.rooms}
      )
      RETURNING
        id,
        name,
        room_names as "rooms",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;
    
    return locations[0];
  }

  async getLocations(): Promise<Location[]> {
    const locations = await this.sql<Location[]>`
      SELECT
        id,
        name,
        room_names as "rooms",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM location_rooms
      ORDER BY name
    `;

    return locations;
  }

  async editLocation(location: Location): Promise<Location> {
    const locations = await this.sql<Location[]>`
      UPDATE location_rooms
      SET 
        name = ${location.name},
        room_names = ${location.rooms},
        updated_at = ${new Date()}
      WHERE location_rooms.id = ${location.id}
      RETURNING
        id,
        name,
        room_names as "rooms",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    return locations[0];
  }

  async deleteLocation(id: Location['id']): Promise<void> {
    await this.sql`
      DELETE FROM location_rooms
      WHERE id = ${id}
    `;
  }
}

export default LocationsRepo;
