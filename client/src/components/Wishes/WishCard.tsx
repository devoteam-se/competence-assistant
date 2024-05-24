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
    <Card withBorder radius="md" style={{ display: 'flex', flexDirection: 'column' }}>
      <Group position="apart" align="top">
        <Box>
          <Title size="lg">{wish.name}</Title>
          <Text c="dimmed" fz="sm">
            {dateLong(wish.createdAt)}
          </Text>
        </Box>
        {canEdit && (
          <Box>
            <WishActions data={wish} />
          </Box>
        )}
      </Group>

      <Divider my="sm" />

      <Stack mt="0" style={{ flexGrow: '1' }}>
        {wish.type && (
          <Group spacing="xs">
            <IconPresentation size={IconSize.md} />
            <Text inline fw="bold">
              {capitalize(wish.type)}
            </Text>
          </Group>
        )}
        {wish.level && <SessionLevel level={wish.level} />}

        <Box>
          <Text lineClamp={wish.type || wish.level ? 5 : 6} ref={refDescription}>
            <Markdown>{wish.description}</Markdown>
          </Text>
        </Box>
      </Stack>
      {showReadMore && (
        <Flex mt="xs" justify="center">
          <Button variant="subtle" size="xs" onClick={user ? () => openWishModal({ wish, user }) : undefined}>
            {t('readMore')}
          </Button>
        </Flex>
      )}
      {user && (
        <>
          <Divider my="sm" />
          <Card.Section inheritPadding>
            <UserStack users={[user]} />
          </Card.Section>
        </>
      )}
    </Card>
  );
};

export default WishCard;
