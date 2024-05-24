import { SessionLevelEnum, SessionTypeEnum } from '@competence-assistant/shared';
import { createConfig } from '../app/config';
import EventRepo from '../core/events/repo/postgres';
import EventService from '../core/events/service/service';
import SessionRepo from '../core/sessions/repo/postgres';
import SessionService from '../core/sessions/service/service';
import TracksRepo from '../core/tracks/repo/postgres';
import TracksService from '../core/tracks/service/service';
import UserRepo from '../core/users/repo/postgres';
import UserService from '../core/users/service/service';
import { createDbConn } from '../pkg/db/postgres';
import Transaction from '../pkg/db/transaction';
import { createLogger } from '../pkg/logger';
import AuthService from '../pkg/auth/firebase';

const getLink = () => {
  return Math.random() > 0.5 ? 'https://meet.google.com/new' : null;
};

const addDays = (numOfDays: number, date = new Date()) => {
  date.setDate(date.getDate() + numOfDays);
  return date.toISOString();
};

/**
 * Returns the array with random length
 */
const getRandomLength = <T>(array: T[], minLength: number, maxLength: number) => {
  return array
    .reduce(
      (acc: T[], curr: T) => {
        return Math.random() < 0.1 ? [...acc, curr] : acc;
      },
      minLength === 0 ? [] : array.slice(0, minLength),
    )
    .slice(0, maxLength);
};

/**
 * Shuffles the array and returns it with random length
 */
const getRandomArray = <T>(array: T[], minLength = 0, maxLength = array.length) => {
  const shuffled = array.toSorted(() => {
    return 0.5 - Math.random();
  });
  const result = getRandomLength(shuffled, minLength, maxLength);
  return [...new Set(result)];
};

/**
 * Fetches mock content for session in markdown
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const getSessionContent = async () => {
  const fetch = (url: string) => import('node-fetch').then(({ default: fetch }) => fetch(url));
  const mdTextUrl = 'https://jaspervdj.be/lorem-markdownum/markdown.txt';
  const name = await fetch(
    `${mdTextUrl}?no-headers=on&no-code=on&no-quotes=on&no-quotes=on&no-lists=on&no-inline-markup=on&no-external-links=on&num-blocks=1`,
  ).then((res) => res.text());
  const shortAlphaNumericName = getRandomArray<string>(name.split(/\s+/), 1, 6)
    .map((s) => s.replace(/[^0-9a-zA-Z]+/, ''))
    .join(' ')
    .toLowerCase();

  const description = await fetch(`${mdTextUrl}`).then((res) => res.text());

  return {
    name: capitalize(shortAlphaNumericName),
    description,
  };
};

const MOCK_TRACKS = [
  { name: 'web', color: '#4df755' },
  { name: 'backend', color: '#4d61f7' },
  { name: 'design', color: '#eff74d' },
  { name: 'code craft', color: '#f00e61' },
  { name: 'leadership', color: '#d41111' },
  { name: 'devOps', color: '#f08826' },
  { name: 'IoT', color: '#2ad4a6' },
];

export const generateData = async (authService: AuthService) => {
  const logger = createLogger();
  const config = createConfig();
  const pool = await createDbConn(config.postgres, logger);

  // Setup repositories
  const eventRepo = new EventRepo(pool);
  const sessionRepo = new SessionRepo(pool);
  const userRepo = new UserRepo(pool);
  const transaction = new Transaction(pool);
  const tracksRepo = new TracksRepo(pool);

  // Setup use services
  const eventService = new EventService(eventRepo, sessionRepo, transaction);
  const sessionService = new SessionService(sessionRepo, eventRepo, transaction, authService);
  const userService = new UserService(userRepo, authService);
  const tracksService = new TracksService(tracksRepo);

  const pastEvent = await eventService.createEvent({
    name: 'K day Halmstad',
    startDate: addDays(-10),
    endDate: addDays(-10),
    votingEndDate: addDays(-15),
  });

  const futureEvent = await eventService.createEvent({
    name: 'K day Malmö',
    startDate: addDays(10),
    endDate: addDays(10),
    votingEndDate: addDays(5),
  });

  await eventService.activateEvent(futureEvent.id);

  const users = await userService.getUsers();
  await Promise.all(users.map((u) => userService.upsertUser(u)));
  const tracksPromises = MOCK_TRACKS.map((track) => tracksService.createTrack(track));

  await Promise.all(tracksPromises);
  const tracks = await tracksService.getTracks();

  const sessionsPromises = [pastEvent, futureEvent].flatMap((event) =>
    users.flatMap((user) => {
      return Array.from(Array(6)).map(async () => {
        const content = await getSessionContent();

        return sessionService.createSession({
          ...content,
          duration: 60,
          hosts: [...getRandomArray(users.filter((u) => u.id !== user.id).map((t) => t.id)), user.id],
          eventId: event.id,
          tracks: getRandomArray(
            tracks.map((t) => t.id),
            1,
          ),
          type: getRandomArray<SessionTypeEnum>(
            [SessionTypeEnum.Session, SessionTypeEnum.Lab, SessionTypeEnum.Roundtable, SessionTypeEnum.Workshop],
            1,
          )[0],
          level: getRandomArray<SessionLevelEnum>(
            [SessionLevelEnum.Beginner, SessionLevelEnum.Intermediate, SessionLevelEnum.Advanced],
            1,
          )[0],
          maxParticipants: 10,
          meetingUrl: getLink(),
          recordingUrl: getLink(),
          slidesUrl: getLink(),
          feedbackUrl: getLink(),
          createdFromSessionId: null,
        });
      });
    }),
  );

  const sessions = await Promise.all(sessionsPromises);

  const votesPromises = users.flatMap((user) => {
    return getRandomArray(sessions, 3, 7).map(
      async ({ id, eventId }) => await sessionService.createVote({ sessionId: id, userId: user.id, eventId: eventId! }),
    );
  });

  await Promise.all(votesPromises);
};
