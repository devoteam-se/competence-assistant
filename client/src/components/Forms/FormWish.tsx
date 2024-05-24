import { TextInput, Textarea, Stack, Button, Group, Select } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { NewWish, NewWishValidator, SessionTypeEnum, SessionLevelEnum } from '@competence-assistant/shared';
import { useTranslation } from 'react-i18next';

interface FormWishProps {
  initialValues?: NewWish;
  onSave: (values: NewWish) => void;
  onCancel?: () => void;
}

const formInitialValues: FormWishProps['initialValues'] = {
  name: '',
  description: '',
  type: '',
  level: '',
};

export const FormWish = ({ initialValues = formInitialValues, onSave, onCancel }: FormWishProps) => {
  const { t } = useTranslation(['wish', 'common']);
  const form = useForm({
    initialValues,
    validate: zodResolver(NewWishValidator),
    validateInputOnChange: true,
  });

  const handleSubmit = async () => {
    form.values['type'] = form.values['type'] === '' ? null : form.values['type'];
    form.values['level'] = form.values['level'] === '' ? null : form.values['level'];

    onSave(form.values);
  };

  return (
    <Stack>
      <TextInput
        withAsterisk
        label={t('form.nameLabel')}
        placeholder={t('form.namePlaceholder')}
        {...form.getInputProps('name')}
      />
      <Textarea
        withAsterisk
        label={t('form.descriptionLabel')}
        placeholder={t('form.descriptionPlaceholder')}
        minRows={10}
        {...form.getInputProps('description')}
      />
      <Select
        label={t('form.typeLabel')}
        data={[
          { label: t('any', { ns: 'common' }), value: '' },
          ...Object.entries(SessionTypeEnum).map(([label, value]) => ({ value, label })),
        ]}
        {...form.getInputProps('type')}
      />
      <Select
        label={t('form.levelLabel')}
        data={[
          { label: t('any', { ns: 'common' }), value: '' },
          ...Object.entries(SessionLevelEnum).map(([label, value]) => ({ value, label })),
        ]}
        {...form.getInputProps('level')}
      />

      <Group position="right">
        {onCancel && (
          <Button name="cancel" variant="subtle" onClick={onCancel}>
            {t('cancel', { ns: 'common' })}
          </Button>
        )}
        <Button disabled={!form.isValid()} variant="filled" onClick={handleSubmit}>
          {t('save', { ns: 'common' })}
        </Button>
      </Group>
    </Stack>
  );
};
