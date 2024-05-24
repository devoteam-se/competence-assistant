import { NewTrack, Track, EditTrack } from '@competence-assistant/shared';
import crypto from 'crypto';
import { Sql } from 'postgres';
import { ITracksRepo } from '../domain';

class TracksRepo implements ITracksRepo {
  constructor(private sql: Sql) {}

  async createTrack(newTrack: NewTrack): Promise<Track> {
    const tracks = await this.sql<Track[]>`
      INSERT INTO tracks (id, name, color) 
      VALUES(
        ${crypto.randomUUID()}, 
        ${newTrack.name}, 
        ${newTrack.color})
      RETURNING 
        id, 
        name, 
        color, 
        created_at as "createdAt",
        updated_at as "updatedAt"`;

    return tracks[0];
  }

  async getTracks(): Promise<Track[]> {
    const tracks = await this.sql<Track[]>`
      SELECT
        id,
        name,
        color,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM
        tracks
      WHERE
        obsolete IS FALSE
    `;

    return tracks;
  }

  async editTrack(track: EditTrack): Promise<Track> {
    const tracks = await this.sql<Track[]>`
      UPDATE tracks
      SET 
        name = ${track.name},
        color = ${track.color},
        updated_at = ${new Date()}
      WHERE tracks.id = ${track.id}
      RETURNING
        id,
        name,
        color,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `;

    return tracks[0];
  }

  async deleteTrack(id: Track['id']): Promise<void> {
    await this.sql`
    UPDATE tracks
    SET 
      obsolete = TRUE
    WHERE tracks.id = ${id}
    `;
  }
}

export default TracksRepo;
