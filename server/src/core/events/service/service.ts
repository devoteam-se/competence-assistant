import { Event, NewEvent, EditEvent, EventFilter, Paging, PagedEvents, EventOrder } from '@competence-assistant/shared';
import { ITransaction } from '../../../pkg/db/transaction';
import { Forbidden } from '../../../pkg/error';
import { IEventRepo, IEventService } from '../domain';
import { ISessionRepo } from '../../sessions/domain';

export default class EventService implements IEventService {
  constructor(private eventRepo: IEventRepo, private sessionRepo: ISessionRepo, private transaction: ITransaction) {}

  async getEvents(filter: EventFilter, paging: Paging, order?: EventOrder): Promise<PagedEvents> {
    const { limit = 20, offset } = paging;

    return this.eventRepo.getEvents(filter, { limit, offset }, order);
  }

  async getEvent(id: string): Promise<Event> {
    return this.eventRepo.getEvent(id);
  }

  async createEvent(newEvent: NewEvent): Promise<Event> {
    const event = await this.eventRepo.createEvent(newEvent);
    return event;
  }

  async editEvent(editEvent: EditEvent): Promise<Event> {
    const event = await this.eventRepo.getEvent(editEvent.id);

    const endDate = new Date(event.endDate).getTime();
    const now = new Date().getTime();

    if (endDate < now) {
      throw new Forbidden('can not edit past event');
    }

    return this.eventRepo.editEvent(editEvent);
  }

  async activateEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepo.getEvent(eventId);

    const endDate = new Date(event.endDate).getTime();
    const now = new Date().getTime();

    if (endDate < now) {
      throw new Forbidden('can not activate past event');
    }

    return this.eventRepo.activateEvent(eventId);
  }

  async deactivateEvent(eventId: string): Promise<Event> {
    return this.transaction.begin(async () => {
      const event = await this.eventRepo.getEvent(eventId);

      const endDate = new Date(event.endDate).getTime();
      const now = new Date().getTime();

      if (endDate < now) {
        await this.sessionRepo.removeEventIdFromSessionsNotInSchedule(eventId);
      }

      return this.eventRepo.deactivateEvent(eventId);
    });
  }

  async deleteEvent(id: string): Promise<void> {
    this.eventRepo.deleteEvent(id);
  }
}
