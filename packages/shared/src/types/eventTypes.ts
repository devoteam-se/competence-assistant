import { z } from 'zod';
import {
  EditEventValidator,
  EventFilterValidator,
  EventStateValidator,
  EventValidator,
  EventWithUniqueVotersValidator,
  NewEventValidator,
} from '../validators';
import { Page } from './pagingTypes';

export type Event = z.infer<typeof EventValidator>;
export type NewEvent = z.infer<typeof NewEventValidator>;
export type EditEvent = z.infer<typeof EditEventValidator>;
export type EventWithUniqueVoters = z.infer<typeof EventWithUniqueVotersValidator>;

export type EventFilter = z.infer<typeof EventFilterValidator>;
export type PagedEvents = Page & { events: EventWithUniqueVoters[] };
export type EventState = z.infer<typeof EventStateValidator>;
