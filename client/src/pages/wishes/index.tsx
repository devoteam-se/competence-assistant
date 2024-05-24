import { openModal, closeAllModals } from '@mantine/modals';
import { IconCirclePlus } from '@tabler/icons-react';
import Wishes from '@/components/Wishes';
import PageHeader from '@/components/PageHeader';
import { FormWish } from '@/components/Forms/FormWish';
import { useWishes } from '@/hooks/wishes';
import { useTranslation } from 'react-i18next';

const PageWishes = () => {
  const { createWish } = useWishes();
  const { t } = useTranslation('wish');

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
                size: 'lg',
                title: t('page.action'),
                children: (
                  <FormWish
                    onSave={(values) => {
                      createWish(values);
                      closeAllModals();
                    }}
                  />
                ),
              }),
          },
        ]}
      />
      <Wishes />
    </>
  );
};

export default PageWishes;
