import { IconCirclePlus } from '@tabler/icons-react';
import PageHeader from '@/components/PageHeader';
import { Sessions } from '@/components/Sessions';
import useIsMobile from '@/hooks/isMobile';
import { openModal } from '@/utils/openModal';
import ModalFormSession from '@/components/Modals/ModalFormSession';
import { useTranslation } from 'react-i18next';

const PageSessions = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('session');

  return (
    <>
      <PageHeader
        title={t('page.title')}
        actions={[
          {
            label: t('page.action'),
            icon: <IconCirclePlus />,
            onClick: () =>
              openModal({
                title: t('page.action'),
                children: <ModalFormSession />,
                fullScreen: isMobile,
                closeOnClickOutside: false,
              }),
          },
        ]}
      />
      <Sessions />
    </>
  );
};

export default PageSessions;
