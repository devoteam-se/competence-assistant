import { EditEvent, Event, EventFilter, NewEvent, PagedEvents, Paging } from '@competence-assistant/shared';
import { get, post, put, _delete } from './method';
import { toQueryString } from '@/utils/querystring';

export type QueryOptions = {
  paging?: Paging;
  filter?: EventFilter;
  order?: string;
};
export default {
  createEvent: async (newEvent: NewEvent) => {
    const event = await post<Event, NewEvent>('events', newEvent);
    return event;
  },
  editEvent: async (newEvent: EditEvent) => {
    const event = await put<Event, EditEvent>(`events/${newEvent.id}`, newEvent);
    return event;
  },
  getEvents: async (options: QueryOptions) => {
    const query = toQueryString(options);
    const events = await get<PagedEvents>(`events?${query}`);
    return events;
  },
  getEvent: async (eventId: string): Promise<Event> => {
    const event = await get<Event>(`events/${eventId}`);
    return event;
  },
  activateEvent: async (id: Event['id']) => {
    const event = await put<Event, undefined>(`events/${id}/activate`);
    return event;
  },
  deactivateEvent: async (id: Event['id']) => {
    const event = await put<Event, undefined>(`events/${id}/deactivate`);
    return event;
  },
  deleteEvent: async (id: Event['id']) => {
    const res = await _delete<null, undefined>(`events/${id}`);
    return res;
  },
};
