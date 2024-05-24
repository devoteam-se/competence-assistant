import { User } from '@competence-assistant/shared';
import { Group, Avatar, Text, CloseButton, MultiSelect, Flex } from '@mantine/core';
import type { SelectItemProps, MultiSelectProps, MultiSelectValueProps } from '@mantine/core';

import { forwardRef } from 'react';

type ItemProps = SelectItemProps & {
  image: User['photoUrl'];
  email: string;
};

/**
 * Custom item for MultiSelect. Will render in the multi select list
 */
const UserSelectItem = forwardRef<HTMLDivElement, ItemProps>(({ image, label, email, ...others }: ItemProps, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <Avatar radius="xl" src={image} />

      <div>
        <Text>{label}</Text>
        <Text size="xs" color="dimmed">
          {email}
        </Text>
      </div>
    </Group>
  </div>
));

UserSelectItem.displayName = 'UserSelectItem';

/**
 * Custom value for MultiSelect. Will render in the multi select input field
 * when a value is selected
 */
type ValueProps = MultiSelectValueProps & { image: User['photoUrl'] };
function UserSelectValue({ image, label, onRemove, disabled, ...rest }: ValueProps) {
  return (
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
      <Avatar radius="xl" src={image} size={24} />
      <Text fz="xs" inline>
        {label}
      </Text>
      {!disabled && (
        <CloseButton onMouseDown={onRemove} variant="transparent" color="gray.7" iconSize={14} tabIndex={-1} />
      )}
    </Flex>
  );
}

type Props = Omit<MultiSelectProps, 'data'> & {
  users: User[];
};

const UserMultiSelect = ({ users, ...props }: Props) => {
  return (
    <MultiSelect
      {...props}
      data={users.map(({ id, name, photoUrl, email }) => ({
        value: id,
        label: name,
        image: photoUrl,
        email,
      }))}
      itemComponent={UserSelectItem}
      valueComponent={UserSelectValue}
    />
  );
};

export default UserMultiSelect;
