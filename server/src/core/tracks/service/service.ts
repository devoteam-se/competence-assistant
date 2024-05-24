import { NewTrack, Track, EditTrack } from '@competence-assistant/shared';
import { ITracksService, ITracksRepo } from '../domain';

export default class TracksService implements ITracksService {
  constructor(private eventRepo: ITracksRepo) {}

  async createTrack(newTrack: NewTrack): Promise<Track> {
    const track = await this.eventRepo.createTrack(newTrack);
    return track;
  }
  async getTracks(): Promise<Track[]> {
    const tracks = await this.eventRepo.getTracks();
    return tracks;
  }
  async editTrack(newTrack: EditTrack): Promise<Track> {
    const track = await this.eventRepo.editTrack(newTrack);
    return track;
  }
  async deleteTrack(id: Track['id']): Promise<void> {
    await this.eventRepo.deleteTrack(id);
  }
}
