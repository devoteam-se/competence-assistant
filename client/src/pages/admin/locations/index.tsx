import { Group, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconCirclePlus } from '@tabler/icons-react';
import { closeAllModals } from '@mantine/modals';

import PageHeader from '@/components/PageHeader';
import { FormLocation } from '@/components/Forms/FormLocation';
import { useLocationMutations, useLocations } from '@/hooks/locations';
import { openConfirmModal, openModal } from '@/utils/openModal';
import FlexCard from '@/components/FlexCard';
import IconButton from '@/components/IconButton';
import CardGrid from '@/components/CardGrid';
import { Location } from '@competence-assistant/shared';
import { useTranslation } from 'react-i18next';

const PageAdminLocations = () => {
  const { data: locations = [], isLoading } = useLocations();
  const { createLocation, editLocation, removeLocation } = useLocationMutations();
  const { t } = useTranslation('admin', { keyPrefix: 'locations' });

  const onAdd = () => {
    openModal({
      title: t('add'),
      children: (
        <FormLocation
          onCancel={closeAllModals}
          onSave={(values) => {
            createLocation(values);
            closeAllModals();
          }}
        />
      ),
    });
  };

  const onEdit = (location: Location) => {
    openModal({
      title: t('edit'),
      children: (
        <FormLocation
          initialValues={location}
          onCancel={closeAllModals}
          onSave={(values) => {
            editLocation({ id: location.id, ...values });
            closeAllModals();
          }}
        />
      ),
    });
  };

  const onDelete = ({ id, name }: Location) => {
    openConfirmModal({
      title: t('delete'),
      children: <Text>{t('deleteConfirm', { name })}</Text>,
      onConfirm: () => removeLocation(id),
    });
  };

  return (
    <>
      <PageHeader
        title={t('title')}
        actions={[
          {
            label: t('add'),
            icon: <IconCirclePlus />,
            onClick: onAdd,
          },
        ]}
      />

      <CardGrid isLoading={isLoading} emptyText={t('empty')} cardSize="sm">
        {locations.map((location) => (
          <FlexCard key={location.id}>
            <Text ml="md">{location.name}</Text>
            <Group ml="auto" spacing="xs">
              <Tooltip label={t('edit')} withArrow position="left">
                <IconButton size="xl" onClick={() => onEdit(location)}>
                  <IconEdit />
                </IconButton>
              </Tooltip>
              <Tooltip label={t('delete')} withArrow position="left">
                <IconButton size="xl" onClick={() => onDelete(location)}>
                  <IconTrash />
                </IconButton>
              </Tooltip>
            </Group>
          </FlexCard>
        ))}
      </CardGrid>
    </>
  );
};

export default PageAdminLocations;
