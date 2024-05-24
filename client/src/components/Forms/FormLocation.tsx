import { TextInput, Stack, Button, Group, MultiSelect, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons-react';

import { NewLocation, EditLocation } from '@competence-assistant/shared';
import { IconSize } from '@/utils/icons';
import { useTranslation } from 'react-i18next';

type Props = {
  initialValues?: NewLocation;
  onSave?: (values: NewLocation | EditLocation) => void;
  onCancel?: () => void;
};

const defaultValues: Props['initialValues'] = { name: '', rooms: [] };
export const FormLocation = ({ initialValues = defaultValues, onCancel, onSave }: Props) => {
  const { t } = useTranslation('admin', { keyPrefix: 'locations.form' });
  const form = useForm({
    initialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? t('nameRequired') : null),
    },
    validateInputOnChange: true,
  });

  const handleSubmitLocation = async () => {
    onSave?.({
      name: form.values.name.trim(),
      rooms: form.values.rooms,
    });
  };

  return (
    <Stack>
      <TextInput
        withAsterisk
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        {...form.getInputProps('name')}
      />
      <MultiSelect
        data={form.values.rooms.map((room) => ({ value: room, label: room }))}
        label={t('roomsLabel')}
        placeholder={t('roomsPlaceholder')}
        searchable
        creatable
        getCreateLabel={(name) => (
          <Group spacing="xs">
            <IconPlus size={IconSize.sm} />
            <Text size="sm">{t('addRoom', { name })}</Text>
          </Group>
        )}
        onCreate={(query) => {
          form.setFieldValue('rooms', [...form.values.rooms, query]);
          return { value: query, label: query };
        }}
        {...form.getInputProps('rooms')}
      />

      <Group position="right">
        <Button name="cancel" variant="subtle" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button disabled={!form.isValid()} variant="filled" onClick={handleSubmitLocation}>
          {t('save')}
        </Button>
      </Group>
    </Stack>
  );
};
