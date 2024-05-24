import { EditTrack, NewTrack, Track } from '@competence-assistant/shared';
import { get, post, put, _delete } from './method';

export default {
  createTrack: async (newTrack: NewTrack) => {
    const event = await post<Track, NewTrack>('tracks', newTrack);
    return event;
  },
  getTracks: async () => {
    const tracks = await get<Track[]>('tracks');
    return tracks;
  },
  editTrack: async (track: EditTrack) => {
    const tracks = await put<Track, EditTrack>(`tracks/${track.id}`, track);
    return tracks;
  },
  deleteTrack: async (id: Track['id']) => {
    const res = await _delete<null, undefined>(`tracks/${id}`);
    return res;
  },
};
