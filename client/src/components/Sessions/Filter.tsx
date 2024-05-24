import * as React from 'react';
import { Button, Indicator, MultiSelect, Popover, Stack, Switch } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';

import { useTracks } from '@/hooks/tracks';
import { SessionFilter, SessionLevelEnum, SessionTypeEnum } from '@competence-assistant/shared';
import { ApplyFilter } from '@/hooks/sessions';
import { useAuth } from '@/contexts/auth';
import EventsMultiSelect from './EventsMultiSelect';
import { useEvents } from '@/hooks/events';
import { useTranslation } from 'react-i18next';
import { IconSize } from '@/utils/icons';

type Props = {
  onApply: ApplyFilter;
  onClear: () => void;
  active: SessionFilter;
  hasFilter: boolean;
  eventId?: string;
};

const Filter = ({ onApply, onClear, active, hasFilter, eventId }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'filter' });
  const { data: tracks = [] } = useTracks();
  const { currentUser } = useAuth();
  const { events, filter: eventFilter } = useEvents({
    initalFilter: { states: active.votable ? ['votable'] : [] },
    enabled: !eventId,
  });

  const filterByTracks = React.useCallback((values: string[]) => onApply('tracks', values), [onApply]);
  const filterByEvents = React.useCallback((values: string[]) => onApply('events', values), [onApply]);
  const filterByTypes = React.useCallback((values: SessionTypeEnum[]) => onApply('types', values), [onApply]);
  const filterByLevels = React.useCallback((values: SessionLevelEnum[]) => onApply('levels', values), [onApply]);
  const filterByFavourite = React.useCallback((value?: string) => onApply('favouritedBy', value), [onApply]);
  const filterByVote = React.useCallback((value?: string) => onApply('votedBy', value), [onApply]);
  const filterByHost = React.useCallback((value?: string) => onApply('hostedBy', value), [onApply]);
  const filterByVotable = React.useCallback(
    (value: boolean) => {
      onApply('votable', value);
      eventFilter.apply('states', value ? ['votable'] : []);
    },
    [onApply, eventFilter],
  );

  return (
    <Popover position="bottom" withArrow shadow="md" width={350}>
      <Popover.Target>
        <Indicator disabled={!hasFilter} position="top-start">
          <Button variant="subtle" color="dark" leftIcon={<IconFilter />}>
            {t('title')}
          </Button>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          {currentUser && (
            <>
              <Switch
                label={t('mine')}
                checked={active.hostedBy === currentUser.id}
                onChange={({ target }) => filterByHost(target.checked ? currentUser.id : undefined)}
              />
              <Switch
                label={t('favourites')}
                checked={active.favouritedBy === currentUser.id}
                onChange={({ target }) => filterByFavourite(target.checked ? currentUser.id : undefined)}
              />
              <Switch
                label={t('votes')}
                checked={active.votedBy === currentUser.id}
                onChange={({ target }) => filterByVote(target.checked ? currentUser.id : undefined)}
              />
            </>
          )}

          {!eventId && (
            <>
              <Switch
                label={t('votable')}
                checked={active.votable}
                onChange={({ target }) => filterByVotable(target.checked)}
              />

              <EventsMultiSelect
                label={t('events')}
                searchable
                events={events.data}
                value={active.events}
                onChange={filterByEvents}
                nothingFound={t('noEvents')}
              />
            </>
          )}

          {tracks.length > 0 && (
            <MultiSelect
              label="Tracks"
              searchable
              data={tracks.map(({ id, name }) => ({ label: name, value: id }))}
              value={active.tracks}
              onChange={filterByTracks}
              nothingFound={t('noTracks')}
            />
          )}

          <MultiSelect
            label="Types"
            searchable
            data={Object.entries(SessionTypeEnum).map(([label, value]) => ({ label, value }))}
            value={active.types}
            onChange={filterByTypes}
            nothingFound={t('noTypes')}
          />
          <MultiSelect
            label="Levels"
            searchable
            data={Object.entries(SessionLevelEnum).map(([label, value]) => ({ label, value }))}
            value={active.levels}
            onChange={filterByLevels}
            nothingFound={t('noLevels')}
          />
          <Button variant="subtle" leftIcon={<IconX size={IconSize.md} />} onClick={onClear} disabled={!hasFilter}>
            {t('clear')}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Filter;
