import { IconCirclePlus } from '@tabler/icons-react';
import Events from '@/components/Events';
import SaveEventModal from '@/components/SaveEventModal';
import { openModal } from '@/utils/openModal';

import PageHeader from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';

const PageAdminEvents = () => {
  const { t } = useTranslation('event', { keyPrefix: 'page' });

  return (
    <>
      <PageHeader
        title={t('title')}
        actions={[
          {
            label: t('action'),
            icon: <IconCirclePlus />,
            onClick: () =>
              openModal({
                title: t('action'),
                children: <SaveEventModal />,
              }),
          },
        ]}
      />
      <Events />
    </>
  );
};

export default PageAdminEvents;
