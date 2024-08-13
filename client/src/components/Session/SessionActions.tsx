import { Text, Menu, Group } from '@mantine/core';
import { IconCopy, IconEdit, IconTrash, IconDotsVertical, IconEye } from '@tabler/icons-react';
import useIsMobile from '@/hooks/isMobile';
import { useSessionMutations } from '@/hooks/sessionMutations';
import { openConfirmModal, openModal } from '@/utils/openModal';
import { Session, EventWithUniqueVoters, Event } from '@competence-assistant/shared';
import ModalFormSession from '@/components/Modals/ModalFormSession';
import { useSessionHelpers, SessionStatus } from '@/hooks/sessionHelpers';
import { useTranslation } from 'react-i18next';
import FavouriteStar from './FavouriteStar';
import { IconSize } from '@/utils/icons';
import IconButton from '../IconButton';
import SessionModal from './SessionModal';

interface SessionActionsProps {
  data: {
    session: Session;
    event?: EventWithUniqueVoters | Event;
  };
}

const SessionActions = ({ data: { session, event } }: SessionActionsProps) => {
  const { t } = useTranslation('session', { keyPrefix: 'actions' });
  const { canEdit, status } = useSessionHelpers({ session, event });
  const isMobile = useIsMobile();
  const { removeSession } = useSessionMutations();

  const onEdit = () => {
    openModal({
      title: t('editTitle'),
      children: <ModalFormSession session={session} />,
      fullScreen: isMobile,
      closeOnClickOutside: false,
    });
  };

  const onCopy = () => {
    openModal({
      title: t('copyTitle'),
      children: <ModalFormSession session={{ ...session, eventId: null }} duplicate />,
      fullScreen: isMobile,
      closeOnClickOutside: false,
    });
  };

  const onDelete = () => {
    openConfirmModal({
      title: t('confirmDeleteTitle'),
      children: <Text>{t('confirmDeleteMessage', { name: session.name })}</Text>,
      onConfirm: () => removeSession(session.id),
    });
  };

  const onOpen = () => {
    openModal({
      title: session.name,
      fullScreen: isMobile,
      children: <SessionModal sessionId={session.id} event={event} />,
    });
  };

  return (
    <Group noWrap spacing={2}>
      <FavouriteStar isFavourite={session.favourite} sessionId={session.id} />
      <Menu width={200}>
        <Menu.Target>
          <IconButton>
            <IconDotsVertical size={IconSize.lg} />
          </IconButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconEye size={IconSize.md} />} onClick={onOpen}>
            {t('view')}
          </Menu.Item>
          {canEdit && (
            <Menu.Item icon={<IconEdit size={IconSize.md} />} onClick={onEdit}>
              {t('edit')}
            </Menu.Item>
          )}
          <Menu.Item icon={<IconCopy size={IconSize.md} />} onClick={onCopy}>
            {t('copy')}
          </Menu.Item>
          {status !== SessionStatus.Done && canEdit && (
            <Menu.Item icon={<IconTrash size={IconSize.md} />} onClick={onDelete}>
              {t('delete')}
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default SessionActions;
