import * as React from 'react';
import { Button, Indicator, Popover, Stack, Switch } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';

import { ApplyFilter } from '@/hooks/events';
import { EventFilter, EventState } from '@competence-assistant/shared';
import { useTranslation } from 'react-i18next';
import { IconSize } from '@/utils/icons';

type Props = {
  onApply: ApplyFilter;
  onClear: () => void;
  active: EventFilter;
  hasFilter: boolean;
  events?: Event[];
};

const Filter = ({ onApply, onClear, active, hasFilter }: Props) => {
  const { t } = useTranslation('event', { keyPrefix: 'filter' });

  const applyStateFilter = React.useCallback(
    (state: EventState, value: boolean) => {
      const states = active.states || [];
      return onApply('states', value ? [...states, state] : states.filter((s) => s !== state));
    },
    [active.states, onApply],
  );

  const filterByFuture = React.useCallback((value: boolean) => applyStateFilter('future', value), [applyStateFilter]);
  const filterByPast = React.useCallback((value: boolean) => applyStateFilter('past', value), [applyStateFilter]);
  const filterByOngoing = React.useCallback((value: boolean) => applyStateFilter('ongoing', value), [applyStateFilter]);
  const filterByActive = React.useCallback((value: boolean) => applyStateFilter('active', value), [applyStateFilter]);
  const filterByVotable = React.useCallback((value: boolean) => applyStateFilter('votable', value), [applyStateFilter]);

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
          <Switch
            onChange={({ target }) => filterByActive(target.checked)}
            checked={active.states?.includes('active')}
            label={t('active')}
          />
          <Switch
            onChange={({ target }) => filterByFuture(target.checked)}
            checked={active.states?.includes('future')}
            label={t('future')}
          />
          <Switch
            onChange={({ target }) => filterByOngoing(target.checked)}
            checked={active.states?.includes('ongoing')}
            label={t('ongoing')}
          />
          <Switch
            onChange={({ target }) => filterByPast(target.checked)}
            checked={active.states?.includes('past')}
            label={t('past')}
          />
          <Switch
            onChange={({ target }) => filterByVotable(target.checked)}
            checked={active.states?.includes('votable')}
            label={t('votable')}
          />
          <Button variant="subtle" leftIcon={<IconX size={IconSize.lg} />} onClick={onClear} disabled={!hasFilter}>
            {t('clear')}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Filter;
