import { Event, EditEvent, NewEvent, EventFilter, Paging, PagedEvents, EventOrder } from '@competence-assistant/shared';

export interface IEventRepo {
  getEvents(filter: EventFilter, paging: Paging, order?: EventOrder): Promise<PagedEvents>;
  getEvent(id: string): Promise<Event>;
  createEvent(newEvent: NewEvent): Promise<Event>;
  editEvent(editEvent: EditEvent): Promise<Event>;
  activateEvent(id: string): Promise<Event>;
  deactivateEvent(id: string): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
}

export interface IEventService {
  getEvents(filter: EventFilter, paging: Paging, order?: EventOrder): Promise<PagedEvents>;
  getEvent(id: string): Promise<Event>;
  createEvent(newEvent: NewEvent): Promise<Event>;
  editEvent(editEvent: EditEvent): Promise<Event>;
  activateEvent(eventId: string): Promise<Event>;
  deactivateEvent(eventId: string): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
}
