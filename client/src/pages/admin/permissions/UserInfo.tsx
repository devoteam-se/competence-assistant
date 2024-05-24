import * as React from 'react';
import { Avatar, Group, Stack, Text, Tooltip } from '@mantine/core';
import IconButton from '@/components/IconButton';

type Props = {
  name: string;
  email: string;
  photoUrl?: string;
  action?: {
    icon: React.ReactNode;
    tooltip?: string;
    onClick: () => void;
  };
};

export const UserInfo = ({ name, email, photoUrl, action }: Props) => {
  return (
    <Group w="100%">
      {photoUrl && <Avatar size="md" radius="xl" src={photoUrl} />}
      <Stack spacing={0}>
        <Text size="md" weight={500}>
          {name}
        </Text>
        <Text color="dimmed" size="xs">
          {email}
        </Text>
      </Stack>
      {action && (
        <Tooltip label={action.tooltip} position="left" withArrow>
          <IconButton ml="auto" size="xl" onClick={action.onClick}>
            {action.icon}
          </IconButton>
        </Tooltip>
      )}
    </Group>
  );
};
