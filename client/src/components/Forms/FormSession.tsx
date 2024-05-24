import {
  Alert,
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { UseFormInput } from '@mantine/form/lib/types';
import { IconAlertCircle, IconCalendarEvent, IconMasksTheater, IconSlideshow, IconVideo } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { useEvents } from '@/hooks/events';

import UserMultiselect from '@/components/UserMultiSelect';
import Markdown from '@/components/Markdown';
import {
  Event,
  NewSession,
  NewSessionValidator,
  SessionLevelEnum,
  SessionTrack,
  SessionTypeEnum,
  User,
} from '@competence-assistant/shared';

import MarkdownCheatSheet from './MarkdownCheatSheet';
import NumberSelect from './NumberSelect';
import { useTranslation } from 'react-i18next';
import { dateShort } from '@/utils/dates';
import { IconSize } from '@/utils/icons';

type Props = {
  event?: Event;
  users: User[];
  currentUser: User | null;
  tracks?: SessionTrack[];
  initialValues?: UseFormInput<NewSession>['initialValues'];
  onSave: (values: NewSession) => void;
  onCancel: () => void;
};

const durations = [
  { value: '5', label: '5 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
  { value: '480', label: '8 hours' },
];

const formInitialValues: NonNullable<Props['initialValues']> = {
  name: '',
  description: '',
  duration: 60,
  type: SessionTypeEnum.Session,
  tracks: [],
  level: null,
  maxParticipants: null,
  hosts: [],
  eventId: null,
  recordingUrl: null,
  slidesUrl: null,
  meetingUrl: null,
  feedbackUrl: null,
  createdFromSessionId: null,
};

export const FormSession = ({
  currentUser,
  users,
  tracks,
  event,
  initialValues = formInitialValues,
  onSave,
  onCancel,
}: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'form' });
  const initialHosts = currentUser ? [currentUser.id] : [];
  const form = useForm<NewSession>({
    initialValues: {
      ...initialValues,
      // Use existing hosts or add current user as a host if there are no hosts
      hosts: initialValues.hosts.length > 0 ? initialValues.hosts : initialHosts,
    },
    validate: zodResolver(NewSessionValidator),
    validateInputOnChange: true,
  });

  const handleSubmit = () => {
    const recordingUrl = form.getInputProps('recordingUrl').value;
    const slidesUrl = form.getInputProps('slidesUrl').value;
    const meetingUrl = form.getInputProps('meetingUrl').value;
    const feedbackUrl = form.getInputProps('feedbackUrl').value;
    const eventId = form.getInputProps('eventId').value;

    const values = {
      name: form.getInputProps('name').value,
      description: form.getInputProps('description').value,
      duration: form.getInputProps('duration').value,
      type: form.getInputProps('type').value,
      level: form.getInputProps('level').value,
      maxParticipants: form.getInputProps('maxParticipants').value,
      tracks: form.getInputProps('tracks').value,
      hosts: form.getInputProps('hosts').value,
      eventId: eventId !== '' ? eventId : null,
      recordingUrl: recordingUrl !== '' ? recordingUrl : null,
      slidesUrl: slidesUrl !== '' ? slidesUrl : null,
      meetingUrl: meetingUrl !== '' ? meetingUrl : null,
      feedbackUrl: feedbackUrl !== '' ? feedbackUrl : null,
      createdFromSessionId: form.getInputProps('createdFromSessionId').value,
    };
    onSave(values);
  };

  const isPast = !!event && dayjs().isAfter(dayjs(event.endDate));
  const { events } = useEvents({
    enabled: !isPast,
    initalFilter: { states: ['active', 'future'] },
  });

  const eventOptions = (isPast ? [event] : events.data).map(({ id, name, startDate }) => ({
    value: id,
    label: `${name} - ${dateShort(startDate)}`,
  }));
  return (
    <Stack>
      {isPast && (
        <Alert color="yellow" icon={<IconAlertCircle />}>
          {t('pastAlert')}
        </Alert>
      )}
      <TextInput
        withAsterisk
        label={t('nameLabel')}
        placeholder={t('namePlaceholder')}
        {...form.getInputProps('name')}
        disabled={isPast}
      />
      <Tabs variant="outline" defaultValue={!isPast ? 'write' : 'preview'}>
        <Tabs.List>
          <Tabs.Tab value="write">
            {t('descriptionLabel')}
            <Text span inherit color="red">
              *
            </Text>
          </Tabs.Tab>
          <Tabs.Tab value="preview">{t('preview')}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="write" mt={-2}>
          <Textarea
            mb="xs"
            placeholder={t('descriptionPlaceholder')}
            minRows={10}
            {...form.getInputProps('description')}
            disabled={isPast}
          />
          <MarkdownCheatSheet />
        </Tabs.Panel>
        <Tabs.Panel value="preview" mt={-1}>
          <Markdown bordered>{form.values.description || t('previewEmpty')}</Markdown>
        </Tabs.Panel>
      </Tabs>

      <Group grow align="start">
        <NumberSelect
          withAsterisk
          label={t('durationLabel')}
          placeholder={t('durationPlaceholder')}
          data={durations}
          {...form.getInputProps('duration')}
          disabled={isPast}
        />
        <Select
          withAsterisk
          label={t('typeLabel')}
          placeholder={t('typePlaceholder')}
          data={Object.entries(SessionTypeEnum).map(([label, value]) => ({ value, label }))}
          {...form.getInputProps('type')}
          disabled={isPast}
        />
      </Group>
      <Group grow align="start">
        <UserMultiselect
          withAsterisk
          label={t('hostsLabel')}
          users={users}
          placeholder={t('hostsPlaceholder')}
          searchable
          {...form.getInputProps('hosts')}
          disabled={isPast}
        />
        <MultiSelect
          withAsterisk
          label={t('tracksLabel')}
          placeholder={t('tracksPlaceholder')}
          data={tracks?.map(({ id, name }) => ({ value: id, label: name })) || []}
          searchable
          {...form.getInputProps('tracks')}
          disabled={isPast}
        />
      </Group>
      <Group grow>
        <Select
          label={t('levelLabel')}
          placeholder={t('levelPlaceholder')}
          data={Object.entries(SessionLevelEnum).map(([label, value]) => ({ value, label }))}
          clearable
          {...form.getInputProps('level')}
          disabled={isPast}
        />
        <NumberInput
          label={t('maxAttendeesLabel')}
          placeholder={t('maxAttendeesPlaceholder')}
          hideControls
          min={0}
          max={1000}
          precision={0}
          {...form.getInputProps('maxParticipants')}
          // input has '' as empty value but we need to convert it to `null`, otherwise zod validation fails
          // `0` is treated as `null` intentionally
          onChange={(value) => form.setFieldValue('maxParticipants', value || null)}
          value={form.values.maxParticipants === null ? undefined : form.values.maxParticipants}
          disabled={isPast}
        />
      </Group>

      <Group grow>
        <TextInput
          label={t('meetingLabel')}
          placeholder={t('meetingPlaceholder')}
          icon={<IconCalendarEvent size={IconSize.md} />}
          {...form.getInputProps('meetingUrl')}
          onChange={({ target: { value } }) => form.setFieldValue('meetingUrl', value || null)}
          value={form.values.meetingUrl === null ? undefined : form.values.meetingUrl}
        />
        <TextInput
          label={t('slidesLabel')}
          placeholder={t('slidesPlaceholder')}
          icon={<IconSlideshow size={IconSize.md} />}
          {...form.getInputProps('slidesUrl')}
          onChange={({ target: { value } }) => form.setFieldValue('slidesUrl', value || null)}
          value={form.values.slidesUrl === null ? undefined : form.values.slidesUrl}
        />
      </Group>
      <Group grow>
        <TextInput
          label={t('recordingLabel')}
          placeholder={t('recordingPlaceholder')}
          icon={<IconVideo size={IconSize.md} />}
          {...form.getInputProps('recordingUrl')}
          onChange={({ target: { value } }) => form.setFieldValue('recordingUrl', value || null)}
          value={form.values.recordingUrl === null ? undefined : form.values.recordingUrl}
        />
        <TextInput
          label={t('feedbackLabel')}
          placeholder={t('feedbackPlaceholder')}
          icon={<IconMasksTheater size={IconSize.md} />}
          {...form.getInputProps('feedbackUrl')}
          onChange={({ target: { value } }) => form.setFieldValue('feedbackUrl', value || null)}
          value={form.values.feedbackUrl === null ? undefined : form.values.feedbackUrl}
        />
      </Group>

      <Select
        label={t('eventLabel')}
        placeholder={t('eventPlaceholder')}
        description={t('eventDescription')}
        clearable
        data={eventOptions}
        {...form.getInputProps('eventId')}
        disabled={isPast}
      />
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
