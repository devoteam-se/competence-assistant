import { Anchor, AnchorProps } from '@mantine/core';
import UserList from './UserList';
import { openModal } from '@/utils/openModal';
import { User } from '@competence-assistant/shared';
import { useTranslation } from 'react-i18next';

type Props = AnchorProps & {
  voters: User[];
  maxParticipants: number | null;
};

const VotersCount = ({ voters, maxParticipants, ...rest }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'info' });
  const onClick = () => {
    openModal({
      title: t('registrants'),
      children: <UserList users={voters} />,
    });
  };

  return (
    <Anchor component="button" type="button" onClick={onClick} {...rest}>
      {maxParticipants ? `${voters.length}/${maxParticipants}` : voters.length}
    </Anchor>
  );
};

export default VotersCount;
