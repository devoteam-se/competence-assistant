import dayjs from 'dayjs';
import { Session, Event, EventWithUniqueVoters } from '@competence-assistant/shared';
import { useAuth } from '@/contexts/auth';

interface SessionHelpersProps {
  session?: Session;
  event?: EventWithUniqueVoters | Event;
}

export enum SessionStatus {
  Draft = 'DRAFT',
  Voting = 'VOTING',
  Scheduled = 'SCHEDULED',
  Done = 'DONE',
}

interface SessionHelpersValue {
  isHost: boolean;
  canEdit: boolean;
  canVote: boolean;
  showVoters: boolean;
  status: SessionStatus | undefined;
}

export const useSessionHelpers = ({ session, event }: SessionHelpersProps): SessionHelpersValue => {
  const { currentUser } = useAuth();

  const votableEvent = event?.active && dayjs().isBefore(dayjs(event.votingEndDate));
  const isHost = Boolean(session?.hosts && session.hosts.find((host) => host.id === currentUser?.id));
  const canEdit = Boolean(isHost || currentUser?.admin);
  const canVote = Boolean(!isHost && votableEvent);

  // Show voters when event is votable OR if the session has votes
  const showVoters = Boolean(votableEvent || (session?.voters && session.voters.length > 0));

  const getStatus = () => {
    if (event && session?.inSchedule && dayjs().isAfter(dayjs(event.endDate))) {
      return SessionStatus.Done;
    }
    if (event && isHost && !session?.inSchedule && votableEvent) {
      return SessionStatus.Voting;
    }
    if (event && session?.inSchedule && dayjs().isBefore(dayjs(event.endDate))) {
      return SessionStatus.Scheduled;
    }
    if (!session?.eventId) {
      return SessionStatus.Draft;
    }
  };

  return { isHost, canVote, canEdit, showVoters, status: getStatus() };
};
