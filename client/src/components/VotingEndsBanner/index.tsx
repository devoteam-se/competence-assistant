import { Badge } from '@mantine/core';
import CountdownTimer from '@/components/CountdownTimer/CountdownTimer';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

type Props = {
  date: string;
};

const VotingEndsBanner = ({ date }: Props) => {
  const { t } = useTranslation('event', { keyPrefix: 'page' });

  return (
    <Badge size="xl" className={styles.pulse}>
      <CountdownTimer prefix={t('votingBanner')} endDate={date} />
    </Badge>
  );
};

export default VotingEndsBanner;
