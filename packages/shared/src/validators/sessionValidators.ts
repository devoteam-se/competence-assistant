import { z } from 'zod';
import { SessionLevelEnum, SessionOrder, SessionTypeEnum } from '../enums/sessionEnums';
import { SessionTrackValidator } from './trackValidators';
import { UserValidator } from './userValidators';
import { EventIdValidator } from './eventValidators';

export const SessionIdValidator = z.string().uuid();

export const SessionValidator = z.object({
  id: SessionIdValidator,
  name: z.string().min(1, { message: 'You must provide a name' }),
  description: z.string().min(1, { message: 'You must provide a description of your session' }),
  type: z.nativeEnum(SessionTypeEnum),
  level: z.nullable(z.nativeEnum(SessionLevelEnum)),
  duration: z.number().gte(0.5).lte(480),
  maxParticipants: z.nullable(z.number().gt(0).lte(1000)),
  recordingUrl: z.nullable(z.union([z.literal(''), z.string().url({ message: 'Invalid URL' })])),
  slidesUrl: z.nullable(z.union([z.literal(''), z.string().url({ message: 'Invalid URL' })])),
  meetingUrl: z.nullable(z.union([z.literal(''), z.string().url({ message: 'Invalid URL' })])),
  feedbackUrl: z.nullable(z.union([z.literal(''), z.string().url({ message: 'Invalid URL' })])),
  eventId: z.nullable(EventIdValidator),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdFromSessionId: z.nullable(z.string().uuid()),
  favourite: z.optional(z.nullable(z.boolean())),
  inSchedule: z.optional(z.boolean()),
  hosts: z.optional(z.array(UserValidator)),
  tracks: z.optional(z.array(SessionTrackValidator)),
  voters: z.optional(z.array(UserValidator)),
});

const InputSessionValidator = SessionValidator.pick({
  id: true,
  name: true,
  description: true,
  type: true,
  level: true,
  duration: true,
  maxParticipants: true,
  recordingUrl: true,
  slidesUrl: true,
  meetingUrl: true,
  feedbackUrl: true,
  eventId: true,
  createdFromSessionId: true,
}).extend({
  hosts: z.array(z.string()).min(1, {
    message: 'You must choose at least one host',
  }),
  tracks: z.array(z.string()).min(1, {
    message: 'You must choose at least one track',
  }),
});

export const NewSessionValidator = InputSessionValidator.omit({
  id: true,
});

export const EditSessionValidator = InputSessionValidator;

export const VoteValidator = z.object({
  sessionId: SessionIdValidator,
  userId: z.string(),
  eventId: EventIdValidator,
});

export const FavouriteValidator = z.object({
  sessionId: SessionIdValidator,
});

export const EditLinksValidator = z.object({
  sessionId: SessionIdValidator,
  recordingUrl: z.nullable(z.string().url()),
  slidesUrl: z.nullable(z.string().url()),
  meetingUrl: z.nullable(z.string().url()),
  feedbackUrl: z.nullable(z.string().url()),
});

export const SessionFilterValidator = z
  .object({
    tracks: z.string().uuid().array(),
    events: z.string().uuid().array(),
    types: z.nativeEnum(SessionTypeEnum).array(),
    levels: z.nativeEnum(SessionLevelEnum).array(),
    favouritedBy: z.string(),
    votedBy: z.string(),
    hostedBy: z.string(),
    votable: z.boolean(),
  })
  .partial();

export const SessionOrderValidator = z.nativeEnum(SessionOrder).optional();
