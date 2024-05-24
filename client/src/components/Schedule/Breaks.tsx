import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Stack } from '@mantine/core';

import ScheduleSession from './ScheduleSession';
import { useTranslation } from 'react-i18next';
import { IconPlus } from '@tabler/icons-react';
import { IconSize } from '@/utils/icons';
import { CalendarEventType } from '@/hooks/schedule';

type TBreak = {
  id: string;
  name: string;
  duration: number;
};

const breaksData: TBreak[] = [
  {
    id: 'coffee-break-15',
    name: 'Coffee break',
    duration: 15,
  },
  {
    id: 'coffee-break-30',
    name: 'Coffee break',
    duration: 30,
  },
  {
    id: 'break-lunch',
    name: 'Lunch',
    duration: 45,
  },
];

type Props = {
  onSave: (values: TBreak) => void;
};

const FormBreak = ({ onSave }: Props) => {
  const { t } = useTranslation('schedule', { keyPrefix: 'breaks' });

  const form = useForm({
    initialValues: { name: '', duration: '15' },
    validate: {
      name: (value) => (value.length === 0 ? t('nameRequired') : null),
      duration: (value) => (value.match('^[1-9][0-9]?$|^100$') ? null : t('durationInvalid')),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.isValid()) {
      const id = `${form.values.name.toLowerCase().replace(' ', '-')}-${form.values.duration}`;
      const values = { ...form.values, id, duration: +form.values.duration };
      onSave(values);
      form.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="xs">
        <TextInput label={t('nameLabel')} placeholder={t('namePlaceholder')} {...form.getInputProps('name')} />
        <TextInput
          label={t('durationLabel')}
          placeholder={t('durationPlaceholder')}
          {...form.getInputProps('duration')}
        />

        <Button
          variant="subtle"
          size="sm"
          type="submit"
          disabled={!form.isValid()}
          leftIcon={<IconPlus size={IconSize.md} />}
        >
          {t('add')}
        </Button>
      </Stack>
    </form>
  );
};

const Breaks = () => {
  const [breaks, setBreaks] = useState(breaksData);

  const addBreak = (values: TBreak) => {
    const id = `${values.name.replace(' ', '-')}-${values.duration}`;
    setBreaks([...breaks, { ...values, id }]);
  };

  return (
    <>
      {breaks.map((b) => (
        <ScheduleSession
          key={b.id}
          id={b.id}
          name={b.name}
          duration={b.duration}
          color="lightgrey"
          type={CalendarEventType.BREAK}
        />
      ))}
      <FormBreak onSave={(values) => addBreak(values)} />
    </>
  );
};

export default Breaks;
