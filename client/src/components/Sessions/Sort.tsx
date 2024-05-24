import { SessionOrder } from '@competence-assistant/shared';

import { Button, Indicator, Popover, Radio, Stack } from '@mantine/core';
import { IconSortDescending } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type Props = {
  active: SessionOrder;
  applySort: (val: SessionOrder) => void;
  hasSort: boolean;
  sortDisabled?: boolean;
};

const SessionsSort = ({ applySort, active, hasSort, sortDisabled = false }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'sort' });
  const options = Object.values(SessionOrder).map((value) => ({ value, label: t(value) }));
  return (
    <Popover width="auto" position="bottom" shadow="md" withArrow disabled={sortDisabled}>
      <Popover.Target>
        <Indicator disabled={!hasSort || sortDisabled} position="top-start">
          <Button variant="subtle" color="dark" leftIcon={<IconSortDescending />} disabled={sortDisabled}>
            {t('title')}
          </Button>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Radio.Group value={active} onChange={(val) => applySort(val as SessionOrder)}>
          <Stack spacing="xs">
            {options.map(({ label, value }) => (
              <Radio key={value} value={value} label={label} />
            ))}
          </Stack>
        </Radio.Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default SessionsSort;
