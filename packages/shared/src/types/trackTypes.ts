import { z } from 'zod';
import { EditTrackValidator, NewTrackValidator, SessionTrackValidator, TrackValidator } from '../validators';

export type SessionTrack = z.infer<typeof SessionTrackValidator>;
export type NewTrack = z.infer<typeof NewTrackValidator>;
export type Track = z.infer<typeof TrackValidator>;
export type EditTrack = z.infer<typeof EditTrackValidator>;
