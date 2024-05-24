import { useRef, useEffect, useState } from 'react';
import { Box, Group, Title, Card, Text, Divider, Stack, Button, Flex } from '@mantine/core';

import { Wish } from '@competence-assistant/shared';
import Markdown from '@/components/Markdown';
import { SessionLevel } from '../Session/SessionInfo';
import UserStack from '@/components/UserStack';
import { useUsers } from '@/hooks/users';
import { useAuth } from '@/contexts/auth';
import WishActions from './WishActions';
import openWishModal from './WishModal';

import { dateLong } from '@/utils/dates';
import { capitalize } from '@/utils/strings';
import { useTranslation } from 'react-i18next';
import { IconPresentation } from '@tabler/icons-react';
import { IconSize } from '@/utils/icons';

interface WishCardProps {
  data: Wish;
}

const WishCard = ({ data: wish }: WishCardProps) => {
  const { t } = useTranslation('common');
  const refDescription = useRef<HTMLDivElement>(null);
  const [showReadMore, setShowReadMore] = useState(false);
  const { currentUser } = useAuth();
  const { users } = useUsers();
  const user = users.data ? users.data.find((user) => user.id === wish.userId) : undefined;
  const canEdit = currentUser?.id === wish.userId || currentUser?.admin;

  useEffect(() => {
    if (refDescription.current && refDescription.current.scrollHeight > refDescription.current.clientHeight) {
      setShowReadMore(true);
    }
  }, [wish]);

  return (
    <Card withBorder radius="md">
      <Stack>
        <Group position="apart" align="top">
          <Box>
            <Title size="lg">{wish.name}</Title>
            <Text c="dimmed" fz="sm">
              {dateLong(wish.createdAt)}
            </Text>
          </Box>
          {canEdit && <WishActions data={wish} />}
        </Group>

        <Divider />

        <Group spacing="sm">
          {wish.level && <SessionLevel level={wish.level} />}
          {wish.type && (
            <Group spacing={4}>
              <IconPresentation size={IconSize.md} />
              <Text inline>{capitalize(wish.type)}</Text>
            </Group>
          )}
        </Group>

        <Box style={{ flexGrow: '1' }}>
          <Text lineClamp={wish.type || wish.level ? 5 : 6} ref={refDescription}>
            <Markdown>{wish.description}</Markdown>
          </Text>
        </Box>

        {showReadMore && (
          <Flex mt="xs" justify="center">
            <Button variant="subtle" size="xs" onClick={user ? () => openWishModal({ wish, user }) : undefined}>
              {t('readMore')}
            </Button>
          </Flex>
        )}
        {user && (
          <>
            <Divider />
            <Card.Section inheritPadding>
              <UserStack users={[user]} />
            </Card.Section>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default WishCard;
