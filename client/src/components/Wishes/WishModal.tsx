import { Box, Group, Text, Divider, Stack, Title } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { Wish, User } from '@competence-assistant/shared';
import Markdown from '@/components/Markdown';
import { SessionLevel } from '../Session/SessionInfo';
import UserStack from '@/components/UserStack';
import { dateLong } from '@/utils/dates';
import { capitalize } from '@/utils/strings';

interface WishModalProps {
  wish: Wish;
  user: User;
}

const openWishModal = ({ wish, user }: WishModalProps) => {
  openModal({
    size: 'xl',
    title: (
      <Box>
        <Title size="lg">{wish.name}</Title>
        <Text c="dimmed" fz="sm">
          {dateLong(wish.createdAt)}
        </Text>
      </Box>
    ),
    children: <WishModalContent wish={wish} user={user} />,
  });
};

const WishModalContent = ({ wish, user }: WishModalProps) => {
  return (
    <>
      <Stack>
        <Group>
          {wish.level && <SessionLevel level={wish.level} />}
          {wish.type && <Text>Type: {capitalize(wish.type)}</Text>}
        </Group>
        <Box>
          <Text>
            <Markdown>{wish.description}</Markdown>
          </Text>
        </Box>
      </Stack>
      <Divider my="xs" />
      <UserStack users={[user]} />
    </>
  );
};

export default openWishModal;
