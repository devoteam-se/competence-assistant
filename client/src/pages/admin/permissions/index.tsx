import { useEffect, useState } from 'react';
import { TextInput, Title, rem } from '@mantine/core';
import { IconSearch, IconUserUp, IconUserDown } from '@tabler/icons-react';
import { IconSize } from '@/utils/icons';
import { useAuth } from '@/contexts/auth';
import { useUserMutations, useUsers } from '@/hooks/users';
import FlexCard from '@/components/FlexCard';
import CardGrid from '@/components/CardGrid';
import PageHeader from '@/components/PageHeader';

import { UserInfo } from './UserInfo';
import { useTranslation } from 'react-i18next';

const PageAdminPermissions = () => {
  const { currentUser } = useAuth();
  const { users, admins, nonAdmins } = useUsers();
  const { revokeAdmin, grantAdmin } = useUserMutations();
  const { t } = useTranslation('admin', { keyPrefix: 'permissions' });

  const [searchString, setSearchString] = useState('');
  const [filteredNonAdmins, setFilteredNonAdmins] = useState(nonAdmins);

  useEffect(() => {
    setFilteredNonAdmins(
      nonAdmins.filter(
        ({ name, email }) => name.toLowerCase().includes(searchString) || email.toLowerCase().includes(searchString),
      ),
    );
  }, [searchString, nonAdmins]);

  const onRemoveAdmin = (userId: string) => revokeAdmin(userId);
  const onAddAdmin = (userId: string) => grantAdmin(userId);

  return (
    <>
      <PageHeader title={t('title')} />
      <Title order={3}>{t('admins')}</Title>
      <CardGrid isLoading={users.isLoading} cardSize="sm">
        {admins.map((user) => {
          const action =
            user.id !== currentUser?.id
              ? { icon: <IconUserDown />, tooltip: t('demote'), onClick: () => onRemoveAdmin(user.id) }
              : undefined;
          return (
            <FlexCard key={user.id}>
              <UserInfo name={user.name} email={user.email} photoUrl={user.photoUrl} action={action} />
            </FlexCard>
          );
        })}
      </CardGrid>

      <Title order={3}>Non admins</Title>
      <TextInput
        onChange={(event) => setSearchString(event.target.value.toLowerCase())}
        icon={<IconSearch size={IconSize.lg} />}
        radius="xl"
        w="100%"
        placeholder={t('filter')}
        rightSectionWidth={rem(42)}
        data-autofocus
      />

      <CardGrid isLoading={users.isLoading} cardSize="sm">
        {filteredNonAdmins.map((user) => {
          return (
            <FlexCard key={user.id}>
              <UserInfo
                name={user.name}
                email={user.email}
                photoUrl={user.photoUrl}
                action={{
                  icon: <IconUserUp />,
                  tooltip: t('promote'),
                  onClick: () => onAddAdmin(user.id),
                }}
              />
            </FlexCard>
          );
        })}
      </CardGrid>
    </>
  );
};

export default PageAdminPermissions;
