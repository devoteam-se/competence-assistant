import { User } from '@competence-assistant/shared';
import { Avatar, Group, Stack, StackProps, Text } from '@mantine/core';

type Props = StackProps & {
  users: User[];
  size?: 'md' | 'sm';
};

const UserList = ({ users, size = 'md', ...props }: Props) => {
  return (
    <Stack {...props}>
      {users.map((user) => (
        <Group key={user.id}>
          <Avatar radius="xl" size={size} src={user.photoUrl} />
          <Text size={size}>{user.name}</Text>
        </Group>
      ))}
    </Stack>
  );
};

export default UserList;
