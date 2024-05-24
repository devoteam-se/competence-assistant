import {
  EventWithUniqueVoters,
  Schedule,
  ScheduleBreak,
  ScheduleSession,
  Session,
  SessionLevelEnum,
  SessionTypeEnum,
  Track,
  User,
} from '@competence-assistant/shared';

export const mockEvent = (id: string, overrides?: Partial<EventWithUniqueVoters>): EventWithUniqueVoters => {
  return {
    id,
    name: 'Event',
    active: false,
    createdAt: '',
    updatedAt: '',
    endDate: '',
    votingEndDate: '',
    startDate: '',
    uniqueVoters: 0,
    sessionCount: 2,
    ...overrides,
  };
};

export const mockTrack = (id: string, overrides?: Partial<Track>): Track => {
  return {
    id,
    name: '',
    color: '',
    obsolete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

export const mockSession = (id: string, overrides?: Partial<Session>): Session => {
  return {
    id,
    tracks: [mockTrack('1')],
    hosts: [mockUser('1', { name: 'User #1' })],
    voters: [],
    name: 'Session name',
    description: 'Session description',
    duration: 60,
    type: SessionTypeEnum.Session,
    level: SessionLevelEnum.Beginner,
    maxParticipants: 10,
    eventId: 'event-1',
    updatedAt: '',
    createdAt: '',
    recordingUrl: null,
    meetingUrl: null,
    slidesUrl: null,
    feedbackUrl: null,
    createdFromSessionId: null,
    ...overrides,
  };
};

export const mockTSession = (id: string, host: User, overrides?: Partial<Session>): Session => {
  return {
    id,
    name: 'Session',
    description: 'Description',
    hosts: [host],
    type: SessionTypeEnum.Workshop,
    level: SessionLevelEnum.Beginner,
    duration: 40,
    maxParticipants: 10,
    tracks: [],
    voters: [],
    createdAt: '',
    updatedAt: '',
    eventId: '',
    recordingUrl: null,
    meetingUrl: null,
    slidesUrl: null,
    feedbackUrl: null,
    createdFromSessionId: null,
    ...overrides,
  };
};

export const mockUser = (id: string, overrides?: Partial<User>): User => {
  return {
    id,
    admin: false,
    email: '',
    name: 'User',
    photoUrl: '',
    ...overrides,
  };
};

export const mockScheduleSession = (sessionId: string, overrides?: Partial<ScheduleSession>): ScheduleSession => {
  return {
    id: 'tmp',
    eventId: 'eventId',
    sessionId,
    roomId: 'room-1',
    start: '2022-10-24T08:00:00+00:00',
    end: '2022-10-24T09:00:00+00:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

export const mockScheduleBreak = (id: string, overrides?: Partial<ScheduleBreak>): ScheduleBreak => {
  return {
    id,
    title: '',
    start: '',
    end: '',
    ...overrides,
  };
};

export const mockSchedule = (overrides?: Partial<Schedule>): Schedule => {
  return {
    sessions: [],
    rooms: [],
    breaks: [],
    ...overrides,
  };
};
