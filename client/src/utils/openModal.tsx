import { openModal as mantineOpenModal, openConfirmModal as mantineOpenConfirmModal } from '@mantine/modals';
import { ModalSettings, OpenConfirmModal } from '@mantine/modals/lib/context';
import i18n from '../i18n';

type OpenModalProps = Omit<ModalSettings, 'title'> & {
  title: string;
};

type OpenConfirmModalProps = Omit<OpenConfirmModal, 'title'> & {
  title: string;
};

export const openModal = ({ title, children, ...props }: OpenModalProps) => {
  return mantineOpenModal({
    title,
    children,
    size: 'xl',
    ...props,
  });
};

export const openConfirmModal = ({ title, children, labels, ...props }: OpenConfirmModalProps) => {
  return mantineOpenConfirmModal({
    title,
    children,
    size: 'md',
    labels: labels ?? { confirm: i18n.t('confirm'), cancel: i18n.t('cancel') },
    ...props,
  });
};
