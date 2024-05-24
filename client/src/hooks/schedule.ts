import Api from '@/api';
import { getTextColor } from '@/utils/colors';
import type { Session } from '@competence-assistant/shared';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useEventSessions } from './sessions';
import dayjs from 'dayjs';

export enum CalendarEventType {
  SESSION = 'session',
  BREAK = 'break',
}

/**
 * Events passed to FullCalendar should
 * use this type
 */
export type SessionEventSource = {
  sessionId: string;
  resourceId: string;
  roomId?: string;
  start: string;
  end: string;
  color: string;
  textColor: string;
  title: string;
  type: CalendarEventType;
  hosts?: { id: string; name: string }[];
  attendees?: string[];
  status?: 'error' | 'warning' | 'disabled';
  hostConflicts?: HostConflict[];
  attendeeConflict?: AttendeeConflict[];
};

export type HostConflict = {
  id: string;
  name: string;
  sessions: { id: string; title: string }[];
};

export type AttendeeConflict = {
  session: { id: string; title: string };
  overlapCount: number;
};

export type BreakEventSource = Omit<SessionEventSource, 'sessionId'>;

type Options = { includeConflicts?: boolean };

const useConflicts = (sessions: Session[]) => {
  const hostMap = useMemo(() => {
    if (sessions.length === 0) return new Map<string, string[]>();

    return sessions.reduce((acc, session) => {
      if (!session.hosts) return acc;

      session.hosts.forEach((host) => {
        acc.set(host.id, [...(acc.get(host.id) || []), session.id]);
      });
      return acc;
    }, new Map<string, string[]>());
  }, [sessions]);

  const getHostConflicts = useCallback(
    (hosts: SessionEventSource['hosts'], overlapping: SessionEventSource[]): SessionEventSource['hostConflicts'] => {
      if (!hosts) return;

      const conflicts = hosts
        .flatMap((host) => {
          const hostedSessionIds = hostMap.get(host.id) || [];
          const hostedOverlap = overlapping.filter((session) => hostedSessionIds.includes(session.sessionId));

          if (hostedOverlap.length === 0) return;
          return {
            id: host.id,
            name: host.name,
            sessions: hostedOverlap.map(({ sessionId, title }) => ({ id: sessionId, title })),
          };
        })
        .filter(Boolean) as HostConflict[];

      if (conflicts.length === 0) return;
      return conflicts;
    },
    [hostMap],
  );

  const getAttendeeConflicts = useCallback(
    (
      attendees: SessionEventSource['attendees'],
      overlapping: SessionEventSource[],
    ): SessionEventSource['attendeeConflict'] => {
      if (!attendees || attendees.length === 0) return;

      const attendeesOfOverlappingSessions = new Set(overlapping.flatMap(({ attendees }) => attendees || []));
      if (attendeesOfOverlappingSessions.size === 0) return;

      return overlapping.map(({ sessionId, title, attendees }) => ({
        session: { id: sessionId, title: title },
        overlapCount: attendees?.filter((id) => attendeesOfOverlappingSessions.has(id)).length || 0,
      }));
    },
    [],
  );

  return { getHostConflicts, getAttendeeConflicts };
};

export const useSchedule = (eventId?: string, { includeConflicts }: Options = {}) => {
  const { data: schedule, isLoading } = useQuery({
    queryKey: ['schedule', eventId],
    queryFn: async () => Api.getSchedule(eventId!),
    staleTime: Infinity,
    enabled: !!eventId,
  });

  const { sessions } = useEventSessions(eventId);
  const sessionMap = useMemo(
    () =>
      sessions.data.reduce((acc, session) => {
        acc.set(session.id, session);
        return acc;
      }, new Map<string, Session>()),
    [sessions.data],
  );

  const { getHostConflicts, getAttendeeConflicts } = useConflicts(includeConflicts ? sessions.data : []);
  const sessionSource = useMemo(() => {
    const mapped = [...Object.values(schedule?.sessions || {})]
      .flatMap((s) => {
        const session = sessionMap.get(s.sessionId);
        if (!session) return;

        const color = session.tracks ? session.tracks[0]?.color : '#ffffff';
        return {
          ...s,
          resourceId: s.roomId,
          color,
          textColor: getTextColor(color),
          title: session.name,
          hosts: session.hosts?.map(({ id, name }) => ({ id, name })),
          attendees: session.voters?.map(({ id }) => id),
          type: CalendarEventType.SESSION,
        } satisfies SessionEventSource;
      })
      .filter(Boolean) as SessionEventSource[];

    return !includeConflicts
      ? mapped
      : mapped.map((session, i, arr) => {
          const overlapping = arr.filter(
            (other) =>
              other.sessionId !== session.sessionId &&
              dayjs(session.start).isBefore(dayjs(other.end)) &&
              dayjs(session.end).isAfter(dayjs(other.start)),
          );
          if (overlapping.length === 0) return session;

          session.hostConflicts = getHostConflicts(session.hosts, overlapping);
          session.attendeeConflict = getAttendeeConflicts(session.attendees, overlapping);
          session.status = session.hostConflicts ? 'error' : session.attendeeConflict ? 'warning' : undefined;
          return session;
        });
  }, [getAttendeeConflicts, getHostConflicts, includeConflicts, schedule?.sessions, sessionMap]);

  const breaks: BreakEventSource[] = useMemo(
    () =>
      schedule?.rooms.flatMap((room) => {
        return Object.values(schedule?.breaks).map((s) => ({
          ...s,
          resourceId: room.id,
          groupId: s.id,
          color: 'lightgrey',
          textColor: 'white',
          type: CalendarEventType.BREAK,
        }));
      }) || [],
    [schedule?.rooms, schedule?.breaks],
  );

  const unscheduledSessions = useMemo(() => {
    return sessions.data
      .filter(({ inSchedule }) => !inSchedule)
      .sort((a, b) => (b.voters?.length || 0) - (a.voters?.length || 0));
  }, [sessions.data]);

  const schedulingStarted = sessions.data.length > unscheduledSessions.length;
  const isEmpty = schedule?.rooms.length === 0 && sessionSource.length === 0 && breaks.length === 0;

  return {
    sessions: sessionSource,
    breaks,
    rooms: schedule?.rooms || [],
    unscheduledSessions,
    isLoading,
    isEmpty,
    schedulingStarted,
  };
};
