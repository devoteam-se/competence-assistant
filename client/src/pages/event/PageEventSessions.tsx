import { useParams } from 'react-router-dom';
import { Sessions } from '@/components/Sessions';

const PageEventSessions = () => {
  const { eventId } = useParams();
  if (!eventId) return null;

  return <Sessions eventId={eventId} />;
};

export default PageEventSessions;
