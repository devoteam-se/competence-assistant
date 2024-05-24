import { useEffect } from 'react';
import { TextInput, Stack, Button, Checkbox, Group } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { NewEvent, NewEventValidator } from '@competence-assistant/shared';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

type Props = {
  initialValues?: NewEvent;
  onSave: (event: NewEvent) => void;
  onCancel: () => void;
};

const formInitialValues: NewEvent = {
  name: '',
  startDate: dayjs().startOf('day').toISOString(),
  endDate: dayjs().endOf('day').toISOString(),
  votingEndDate: dayjs().endOf('day').toISOString(),
};

export const FormEvent = ({ initialValues = formInitialValues, onSave, onCancel }: Props) => {
  const { t } = useTranslation('event', { keyPrefix: 'form' });
  const form = useForm({
    initialValues,
    validate: zodResolver(NewEventValidator),
    validateInputOnChange: true,
  });

  useEffect(() => {
    form.validateField('endDate');
    form.validateField('votingEndDate');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.endDate, form.values.votingEndDate]);

  const handleSubmit = () => {
    const values = {
      name: form.values.name,
      startDate: dayjs(form.values.startDate).startOf('day').toISOString(),
      endDate: dayjs(form.values.endDate).endOf('day').toISOString(),
      votingEndDate: form.values.votingEndDate ? dayjs(form.values.votingEndDate).endOf('day').toISOString() : null,
    };

    onSave(values);
  };

  return (
    <Stack>
      <TextInput withAsterisk label={t('name')} placeholder={t('namePlaceholder')} {...form.getInputProps('name')} />
      <DatePickerInput
        label={t('duration')}
        type="range"
        modalProps={{ zIndex: 201 }}
        popoverProps={{ zIndex: 202, withinPortal: true }}
        allowSingleDateInRange
        minDate={dayjs().toDate()}
        value={[
          form.values.startDate !== '' ? dayjs(form.values.startDate).toDate() : null,
          form.values.endDate !== '' ? dayjs(form.values.endDate).toDate() : null,
        ]}
        onChange={(value) => {
          form.setFieldValue('startDate', value[0] ? value[0].toISOString() : '');
          form.setFieldValue('endDate', value[1] ? value[1].toISOString() : '');
        }}
      />
      <Checkbox
        label={t('enableRegistration')}
        checked={form.values.votingEndDate !== null}
        onChange={(e) => {
          form.setFieldValue('votingEndDate', e.currentTarget.checked ? dayjs().toISOString() : null);
        }}
      />
      {form.values.votingEndDate !== null ? (
        <DatePickerInput
          label={t('registrationDeadline')}
          popoverProps={{ zIndex: 202, withinPortal: true }}
          minDate={dayjs().toDate()}
          {...form.getInputProps('votingEndDate')}
          value={form.values.votingEndDate ? dayjs(form.values.votingEndDate).toDate() : null}
          onChange={(value) => {
            form.setFieldValue('votingEndDate', value?.toISOString() || dayjs().toISOString());
          }}
        />
      ) : null}
      <Group position="right">
        <Button name="cancel" variant="subtle" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button disabled={!form.isValid()} variant="filled" type="submit" onClick={handleSubmit}>
          {t('save')}
        </Button>
      </Group>
    </Stack>
  );
};
