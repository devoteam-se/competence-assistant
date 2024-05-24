import { NewTrack, Track, EditTrack } from '@competence-assistant/shared';

export interface ITracksRepo {
  createTrack(track: NewTrack): Promise<Track>;
  getTracks(): Promise<Track[]>;
  editTrack(track: EditTrack): Promise<Track>;
  deleteTrack(id: Track['id']): Promise<void>;
}

export interface ITracksService {
  createTrack(newTrack: NewTrack): Promise<Track>;
  getTracks(): Promise<Track[]>;
  editTrack(track: EditTrack): Promise<Track>;
  deleteTrack(id: Track['id']): Promise<void>;
}
