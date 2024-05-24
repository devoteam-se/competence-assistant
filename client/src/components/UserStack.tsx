import { User } from '@competence-assistant/shared';
import { Avatar, Group, GroupProps, Text, Tooltip } from '@mantine/core';

type Props = GroupProps & {
  users: User[];
};

const UserStack = ({ users, ...props }: Props) => {
  return (
    <Group {...props} align="center">
      <Avatar.Group>
        {users.map((user) => (
          <Tooltip key={user.id} label={user.name} withArrow>
            <Avatar radius="xl" size="md" src={user.photoUrl} />
          </Tooltip>
        ))}
      </Avatar.Group>
      {users.length === 1 && users[0] && <Text>{users[0].name}</Text>}
    </Group>
  );
};

export default UserStack;
