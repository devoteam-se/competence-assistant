import Api from '@/api';
import { sendNotification } from '@/utils/notifications';
import { User } from '@competence-assistant/shared';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useOptimisticMutation } from './optimisticMutation';

export const useUsers = () => {
  const users = useQuery({ queryKey: ['users'], queryFn: Api.getUsers, staleTime: Infinity });
  const admins = useMemo(() => {
    return users.data && users.data.length > 0
      ? users.data.filter((user) => user.admin).toSorted((a, b) => a.name.localeCompare(b.name))
      : [];
  }, [users.data]);

  const nonAdmins = useMemo(() => {
    return users.data && users.data.length > 0
      ? users.data.filter((user) => !user.admin).toSorted((a, b) => a.name.localeCompare(b.name))
      : [];
  }, [users.data]);

  return { users, admins, nonAdmins };
};

export const useUserMutations = () => {
  const { mutate: grantAdmin } = useGrantAdmin();
  const { mutate: revokeAdmin } = useRevokeAdmin();

  return { grantAdmin, revokeAdmin };
};

const useGrantAdmin = () => {
  const updater = (oldData: User[] | undefined, selectedUserId: string) => {
    return oldData?.map((user) => (user.id === selectedUserId ? { ...user, admin: true } : user)) || [];
  };

  const onSuccess = (_data: string, userId: string, context: any) => {
    const user = context.find((u: User) => u.id === userId);
    user && sendNotification({ status: 'INFO', message: `Made ${user.name} admin` });
  };

  return useOptimisticMutation(Api.grantAdmin, ['users'], updater, { onSuccess });
};

const useRevokeAdmin = () => {
  const updater = (oldData: User[] | undefined, selectedUserId: string) => {
    return oldData?.map((user) => (user.id === selectedUserId ? { ...user, admin: false } : user)) || [];
  };

  const onSuccess = (_data: string, userId: string, context: any) => {
    const user = context.find((u: User) => u.id === userId);
    user && sendNotification({ status: 'INFO', message: `Removed ${user.name} as admin` });
  };

  return useOptimisticMutation(Api.revokeAdmin, ['users'], updater, { onSuccess });
};
