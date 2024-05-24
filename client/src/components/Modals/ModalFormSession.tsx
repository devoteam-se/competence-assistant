import { closeAllModals } from '@mantine/modals';

import { useEvent } from '@/hooks/events';
import { useTracks } from '@/hooks/tracks';
import { useUsers } from '@/hooks/users';
import { useSessionMutations } from '@/hooks/sessionMutations';
import { useAuth } from '@/contexts/auth';
import { EditSession, NewSession, Session } from '@competence-assistant/shared';

import { FormSession } from '@/components/Forms/FormSession';

interface FormSessionModalProps {
  session?: Session;
  duplicate?: boolean;
}

const FormSessionModal = ({ session, duplicate = false }: FormSessionModalProps) => {
  const { currentUser } = useAuth();
  const { data: event } = useEvent(session?.eventId);
  const { data: tracks } = useTracks();
  const { users } = useUsers();
  const { editSession, createSession } = useSessionMutations();

  const onSave = (input: NewSession | EditSession) => {
    save(input);
    closeAllModals();
  };

  const save = (input: NewSession | EditSession) => {
    if (!session) return createSession(input);
    if (duplicate) return createSession({ ...input, createdFromSessionId: session.id });
    return editSession({ ...input, id: session.id });
  };

  const initialValues: Omit<EditSession, 'id'> | undefined = session
    ? {
        name: session.name,
        description: session.description,
        duration: session.duration,
        type: session.type,
        level: session.level,
        maxParticipants: session.maxParticipants,
        tracks: session.tracks ? session.tracks.map((track) => track.id) : [],
        hosts: session.hosts ? session.hosts.map((user) => user.id) : [],
        eventId: session.eventId,
        recordingUrl: session.recordingUrl,
        slidesUrl: session.slidesUrl,
        meetingUrl: session.meetingUrl,
        feedbackUrl: session.feedbackUrl,
        createdFromSessionId: session.createdFromSessionId,
      }
    : undefined;

  return (
    <FormSession
      users={users.data || []}
      tracks={tracks || []}
      initialValues={initialValues}
      onSave={onSave}
      onCancel={closeAllModals}
      event={event}
      currentUser={currentUser}
    />
  );
};

export default FormSessionModal;
