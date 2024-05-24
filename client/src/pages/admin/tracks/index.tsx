import { ColorSwatch, Group, Text, Tooltip, rem } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { IconEdit, IconTrash, IconCirclePlus } from '@tabler/icons-react';

import { FormTrack } from '@/components/Forms/FormTrack';
import { useTrackMutations, useTracks } from '@/hooks/tracks';
import { openConfirmModal, openModal } from '@/utils/openModal';
import FlexCard from '@/components/FlexCard';

import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import { useTranslation } from 'react-i18next';
import CardGrid from '@/components/CardGrid';
import { Track } from '@competence-assistant/shared';

const PageAdminTracks = () => {
  const { data: tracks = [], isLoading } = useTracks();
  const { removeTrack, editTrack, createTrack } = useTrackMutations();
  const { t } = useTranslation('admin', { keyPrefix: 'tracks' });

  const onAdd = () => {
    openModal({
      title: t('add'),
      children: (
        <FormTrack
          onCancel={closeAllModals}
          onSave={(values) => {
            createTrack(values);
            closeAllModals();
          }}
        />
      ),
    });
  };

  const onEdit = (track: Track) => {
    openModal({
      title: t('edit'),
      children: (
        <FormTrack
          initialValues={track}
          onCancel={closeAllModals}
          onSave={(values) => {
            editTrack({ id: track.id, ...values });
            closeAllModals();
          }}
        />
      ),
    });
  };

  const onDelete = ({ id, name }: Track) => {
    openConfirmModal({
      title: t('delete'),
      children: <Text>{t('deleteConfirm', { name })}</Text>,
      onConfirm: () => removeTrack(id),
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
        {tracks
          .filter(({ obsolete }) => !obsolete)
          .map((track) => (
            <FlexCard key={track.id}>
              <ColorSwatch color={track.color} size={rem(40)} />
              <Text ml="md">{track.name}</Text>
              <Group ml="auto" spacing="xs">
                <Tooltip label={t('edit')} withArrow position="left">
                  <IconButton size="xl" onClick={() => onEdit(track)}>
                    <IconEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip label={t('delete')} withArrow position="left">
                  <IconButton size="xl" onClick={() => onDelete(track)}>
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

export default PageAdminTracks;
