import { ActionIcon, Badge, Group, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import IconButton from '../IconButton';
import { IconPlus, IconX } from '@tabler/icons-react';
import { IconSize } from '@/utils/icons';
import { useRoomMutations } from '@/hooks/roomMutations';
import { useSchedule } from '@/hooks/schedule';
import { useLocations } from '@/hooks/locations';
import { useTranslation } from 'react-i18next';

const FormRoom = ({ onSave }: { onSave: (value: string) => void }) => {
  const { t } = useTranslation('schedule', { keyPrefix: 'rooms' });

  const form = useForm({
    initialValues: { name: '' },
    validate: { name: (value) => (value.trim().length === 0 ? t('roomNameRequired') : null) },
    validateInputOnChange: true,
  });

  return (
    <form
      onSubmit={form.onSubmit(({ name }) => {
        onSave(name);
        form.reset();
      })}
    >
      <Group spacing="xs" noWrap>
        <TextInput w="100%" size="xs" placeholder={t('addRoom')} {...form.getInputProps('name')} />
        <ActionIcon type="submit" variant="subtle" radius="xl" color="primary" disabled={!form.isValid()}>
          <IconPlus size={IconSize.sm} />
        </ActionIcon>
      </Group>
    </form>
  );
};

const Rooms = ({ eventId }: { eventId: string }) => {
  const { t } = useTranslation('schedule', { keyPrefix: 'rooms' });
  const { createRoom, setRoomTemplate, resetRoomTemplate, removeRoom } = useRoomMutations(eventId);
  const { data: locations = [], isLoading: loadingLocations } = useLocations();
  const { rooms, isLoading: loadingSchedule } = useSchedule(eventId);

  const onLocationChange = (locationId: string | null) => {
    if (rooms.length > 0) {
      resetRoomTemplate({ roomIds: rooms.map(({ id }) => id) || [], eventId });
    }

    const selected = locations.find(({ id }) => id === locationId);

    if (selected && selected.rooms.length > 0) {
      setRoomTemplate({ roomNames: selected.rooms.map((room) => ({ name: room })), eventId });
    }
  };

  if (loadingSchedule) return 'Loading...';
  if (rooms.length === 0 && locations.length > 0) {
    return (
      <Select
        withinPortal
        disabled={loadingLocations}
        label={t('locationLabel')}
        placeholder={t('locationPlaceholder')}
        data={locations.map(({ name, id }) => ({ label: name, value: id }))}
        onChange={onLocationChange}
      />
    );
  }

  return (
    <>
      <Group>
        {rooms.map((room) => (
          <Badge
            key={room.id}
            pr={3}
            rightSection={
              <IconButton size="xs" variant="transparent" onClick={() => removeRoom({ eventId, roomId: room.id })}>
                <IconX size={IconSize.xs} />
              </IconButton>
            }
          >
            {room.name}
          </Badge>
        ))}
      </Group>
      <FormRoom onSave={(name) => createRoom({ eventId, name })} />
    </>
  );
};

export default Rooms;
