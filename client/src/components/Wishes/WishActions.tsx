import { Group, Text, Menu } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { openConfirmModal, openModal } from '@/utils/openModal';
import { IconEdit, IconTrash, IconDotsVertical } from '@tabler/icons-react';
import { Wish } from '@competence-assistant/shared';

import { FormWish } from '@/components/Forms/FormWish';
import { useWishes } from '@/hooks/wishes';
import { useTranslation } from 'react-i18next';
import useIsMobile from '@/hooks/isMobile';
import { IconSize } from '@/utils/icons';
import IconButton from '../IconButton';

interface WishActionsProps {
  data: Wish;
}

const WishActions = ({ data: wish }: WishActionsProps) => {
  const { t } = useTranslation(['wish', 'common']);
  const { editWish, removeWish } = useWishes();
  const isMobile = useIsMobile();

  const openEditWishModal = () => {
    openModal({
      size: 'lg',
      title: t('actions.editTitle'),
      closeOnClickOutside: false,
      fullScreen: isMobile,
      children: (
        <FormWish
          initialValues={wish}
          onSave={(values) => {
            editWish({ id: wish.id, ...values });
            closeAllModals();
          }}
          onCancel={() => closeAllModals()}
        />
      ),
    });
  };

  const openRemoveWishModal = () => {
    openConfirmModal({
      title: t('actions.deleteTitle'),
      children: <Text>{t('actions.deleteMessage', { name: wish.name })}</Text>,
      onConfirm: () => removeWish(wish.id),
    });
  };

  return (
    <Group noWrap spacing={2}>
      <Menu width={200}>
        <Menu.Target>
          <IconButton>
            <IconDotsVertical size={IconSize.lg} />
          </IconButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconEdit size={IconSize.md} />} onClick={openEditWishModal}>
            {t('actions.edit')}
          </Menu.Item>
          <Menu.Item icon={<IconTrash size={IconSize.md} />} onClick={openRemoveWishModal}>
            {t('actions.delete')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default WishActions;
