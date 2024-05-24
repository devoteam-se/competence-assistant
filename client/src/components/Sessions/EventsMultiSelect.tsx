import React from 'react';
import { Event } from '@competence-assistant/shared';
import { Box, CloseButton, Flex, MultiSelect, Text } from '@mantine/core';
import type { SelectItemProps, MultiSelectProps, MultiSelectValueProps } from '@mantine/core';
import { dateLong } from '@/utils/dates';

type ItemProps = SelectItemProps & { startDate: Event['startDate'] };
const Item = React.forwardRef<HTMLDivElement, ItemProps>(({ label, startDate, ...rest }, ref) => (
  <Box ref={ref} {...rest}>
    <Text size="sm">{label}</Text>
    <Text size="xs" color="dimmed">
      {dateLong(startDate)}
    </Text>
  </Box>
));
Item.displayName = 'EventItem';

type ValueProps = MultiSelectValueProps & { startDate: Event['startDate'] };
// Descructure startDate from props in order to avoid passing it to the Flex component
// which would in turn pass it to the DOM and cause a console error.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Value = ({ label, startDate, onRemove, disabled, ...rest }: ValueProps) => (
  <Flex
    {...rest}
    align="center"
    gap="xs"
    bg="gray.1"
    sx={(theme) => ({
      padding: `2px 2px 2px ${theme.spacing.xs}`,
      borderRadius: theme.radius.sm,
    })}
  >
    <Text size="xs">{label}</Text>
    <CloseButton
      onMouseDown={onRemove}
      variant="transparent"
      color="gray.7"
      size={22}
      iconSize={14}
      tabIndex={-1}
      disabled={disabled}
    />
  </Flex>
);

type Props = Omit<MultiSelectProps, 'data'> & { events: Event[] };
const EventsMultiSelect = ({ events, ...props }: Props) => (
  <MultiSelect
    {...props}
    data={events.map(({ id, name, startDate }) => ({
      value: id,
      label: name,
      startDate,
    }))}
    itemComponent={Item}
    valueComponent={Value}
  />
);

export default EventsMultiSelect;
