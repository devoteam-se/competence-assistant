import '@fullcalendar/react/dist/vdom';
import { TextInput, Stack, Button, ColorPicker, Group, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

import Badge from '@/components/Badge';
import ScheduleSessionCardInfo from '../Schedule/ScheduleSessionCardInfo';
import ScheduleSessionCard from '../Schedule/ScheduleSessionCard';
import { NewTrack } from '@competence-assistant/shared';
import { useTranslation } from 'react-i18next';
import { CalendarEventType } from '@/hooks/schedule';

type Props = {
  initialValues?: { name: string; color: string };
  onSave?: (values: NewTrack) => void;
  onCancel?: () => void;
};

const defaultValues: Props['initialValues'] = { name: '', color: '#FFF' };
export const FormTrack = ({ initialValues = defaultValues, onCancel, onSave }: Props) => {
  const { t } = useTranslation('admin', { keyPrefix: 'tracks.form' });
  const form = useForm({
    initialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? t('nameRequired') : null),
      color: (value) => (!value.match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/) ? t('invalidColor') : null),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = async () => {
    onSave?.({
      name: form.values.name.trim(),
      color: form.values.color,
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
      <Group grow align="start">
        <TextInput label={t('colorLabel')} placeholder={t('colorPlaceholder')} {...form.getInputProps('color')} />
        <Stack spacing={0}>
          <Text size="sm" weight={500}>
            {t('colorPickerLabel')}
          </Text>
          <ColorPicker format="hex" {...form.getInputProps('color')} w="100%" />
        </Stack>
      </Group>
      <Text size="sm" weight={500}>
        {t('colorPreview')}
      </Text>
      <Group grow align="start">
        <ScheduleSessionCard
          id=""
          name={t('previewSession')}
          color={form.values.color}
          duration={60}
          type={CalendarEventType.SESSION}
        >
          <ScheduleSessionCardInfo votes={42} duration={60} />
        </ScheduleSessionCard>
        <Badge label={t('previewBadge')} color={form.values.color} />
      </Group>

      <Group position="right">
        <Button name="cancel" variant="subtle" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button disabled={!form.isValid()} variant="filled" onClick={handleSubmit}>
          {t('save')}
        </Button>
      </Group>
    </Stack>
  );
};
