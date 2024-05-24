import { EventWithUniqueVoters } from '@competence-assistant/shared';
import { CopyButton, Group, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconDotsVertical, IconEye, IconEyeOff, IconCheck, IconLink } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { openModal, openConfirmModal } from '@/utils/openModal';
import EditEventModal from '@/components/SaveEventModal';
import { useEventMutations, useToggleEventActive } from '@/hooks/eventMutations';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { IconSize } from '@/utils/icons';
import IconButton from '../IconButton';

const EventActions = ({ event }: { event: EventWithUniqueVoters }) => {
  const { t } = useTranslation('event', { keyPrefix: 'actions' });
  const { removeEvent } = useEventMutations();
  const toggleActiveMutation = useToggleEventActive(event.active);
  const toggleActive = useCallback(() => toggleActiveMutation(event.id), [event, toggleActiveMutation]);

  const url = `${new URL(window.location.href).origin}/events/${event.id}/sessions?layout=minimal`;

  const isPast = dayjs(event.endDate).isBefore(dayjs());
  const showMenu = !isPast || event.active;

  const onEdit = () => {
    openModal({
      title: t('editTitle'),
      children: <EditEventModal event={event} />,
      closeOnClickOutside: false,
    });
  };

  const onDelete = () => {
    openConfirmModal({
      title: t('deleteTitle'),
      size: 'xl',
      onConfirm: () => removeEvent(event.id),
      children: (
        <Stack spacing="sm">
          <Text truncate>{t('confirmDelete1', { name: event.name })}</Text>
          <Text>
            {t('confirmDelete2', { sessionCount: event.sessionCount ?? 0, attendeeCount: event.uniqueVoters ?? 0 })}
          </Text>
        </Stack>
      ),
    });
  };

  const onToggleVisibility = () => {
    openConfirmModal({
      title: t(event.active ? 'hideTitle' : 'showTitle'),
      onConfirm: toggleActive,
      children: (
        <Stack spacing="sm">
          <Text>{t(event.active ? 'confirmHide1' : 'confirmShow1', { name: event.name })}</Text>
          <Text>{t(event.active ? 'confirmHide2' : 'confirmShow2')}</Text>
        </Stack>
      ),
    });
  };

  return (
    <Group noWrap spacing={2}>
      <CopyButton value={url}>
        {({ copied, copy }) => (
          <Tooltip label={t(copied ? 'copiedUrl' : 'copyUrl')} withArrow bg={copied ? 'teal' : ''}>
            <IconButton onClick={copy}>
              {copied ? <IconCheck size={IconSize.lg} /> : <IconLink size={IconSize.lg} />}
            </IconButton>
          </Tooltip>
        )}
      </CopyButton>
      {showMenu && (
        <Menu width={200}>
          <Menu.Target>
            <IconButton>
              <IconDotsVertical size={IconSize.lg} />
            </IconButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={event.active ? <IconEyeOff size={IconSize.md} /> : <IconEye size={IconSize.md} />}
              onClick={onToggleVisibility}
            >
              {event.active ? t('hide') : t('show')}
            </Menu.Item>

            {!isPast && (
              <>
                <Menu.Item icon={<IconEdit size={IconSize.md} />} onClick={onEdit}>
                  {t('edit')}
                </Menu.Item>
                <Menu.Item icon={<IconTrash size={IconSize.md} />} onClick={onDelete}>
                  {t('delete')}
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
};

export default EventActions;
