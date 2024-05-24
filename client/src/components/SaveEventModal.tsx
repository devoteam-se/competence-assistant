import { closeAllModals } from '@mantine/modals';

import { NewEvent, Event, EditEvent } from '@competence-assistant/shared';
import { useEventMutations } from '@/hooks/eventMutations';
import { FormEvent } from '@/components/Forms/FormEvent';

const CreateOrEditEventModal = ({ event }: { event?: Event }) => {
  const { editEvent, createEvent } = useEventMutations();

  const handleSave = (values: NewEvent | EditEvent) => {
    if (event?.id) {
      editEvent({ ...event, ...values });
    } else {
      createEvent(values);
    }
    closeAllModals();
  };

  return <FormEvent initialValues={event} onSave={handleSave} onCancel={closeAllModals} />;
};

export default CreateOrEditEventModal;
