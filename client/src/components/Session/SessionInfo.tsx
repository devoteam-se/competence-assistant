import Badge from '@/components/Badge';
import DurationDisplay from '@/components/DurationDisplay';
import { SessionLevelEnum, Session } from '@competence-assistant/shared';
import { ActionIcon, Box, Group, MantineNumberSize, Stack, Text, Tooltip } from '@mantine/core';
import {
  IconCalendarEvent,
  IconMasksTheater,
  IconPresentation,
  IconSlideshow,
  IconUsers,
  IconVideo,
} from '@tabler/icons-react';
import React from 'react';
import VotersCount from '../VotersCount';
import { capitalize } from '@/utils/strings';
import { useTranslation } from 'react-i18next';
import { IconSize } from '@/utils/icons';

type Props = {
  session: Session;
  showVoters?: boolean;
  showLinks?: boolean;
};

const SessionInfo = ({ session, showVoters, showLinks }: Props) => {
  const { t } = useTranslation('session', { keyPrefix: 'info' });
  return (
    <Stack>
      <Group spacing="sm">
        {session.level && <SessionLevel level={session.level} />}

        <Group spacing={4} noWrap>
          <IconPresentation size={IconSize.md} />
          <Text size="sm" inline>
            {capitalize(session.type)}
          </Text>
        </Group>

        <DurationDisplay duration={session.duration} size="sm" />

        {showVoters && session.voters && (
          <Group spacing={4} noWrap>
            <IconUsers size={IconSize.md} />
            <VotersCount inline size="sm" voters={session.voters} maxParticipants={session.maxParticipants} />
          </Group>
        )}
      </Group>

      <Group spacing="xs">
        {session.tracks &&
          session.tracks.map((track) => <Badge key={track.id} color={track.color} label={track.name} />)}
      </Group>
      {showLinks && (
        <Group spacing="xs">
          <LinkUrl label={t('meeting')} url={session.meetingUrl} icon={<IconCalendarEvent size={IconSize.md} />} />
          <LinkUrl label={t('slides')} url={session.slidesUrl} icon={<IconSlideshow size={IconSize.md} />} />
          <LinkUrl label={t('recording')} url={session.recordingUrl} icon={<IconVideo size={IconSize.md} />} />
          <LinkUrl label={t('feedback')} url={session.feedbackUrl} icon={<IconMasksTheater size={IconSize.md} />} />
        </Group>
      )}
    </Stack>
  );
};

type SessionLevelProps = {
  level: SessionLevelEnum;
  size?: MantineNumberSize;
};

export const SessionLevel = ({ level, size = 'sm' }: SessionLevelProps) => {
  const levelArray = Object.values(SessionLevelEnum);
  const levelIndex = levelArray.indexOf(level);
  return (
    <Group spacing="xs">
      <Group spacing={2}>
        {levelArray.map((v, index) => (
          <Box
            key={v}
            h={size}
            w={size}
            sx={(theme) => ({
              borderRadius: '50%',
              backgroundColor: index <= levelIndex ? `${theme.colors.blue[3 + index]}` : `${theme.colors.gray[3]}`,
            })}
          />
        ))}
      </Group>
      <Text size={size}>{capitalize(level)}</Text>
    </Group>
  );
};

type LinkUrlProps = {
  label: string;
  url: string | null;
  icon: React.ReactNode;
};

const LinkUrl = ({ label, url, icon }: LinkUrlProps) => {
  const { t } = useTranslation('session', { keyPrefix: 'info' });

  const tooltipLabel = url ? label : t('missing', { link: label });
  return (
    <Tooltip label={tooltipLabel} fz="xs" withArrow>
      <Box>
        <ActionIcon
          component="a"
          target="_blank"
          rel="noreferrer"
          href={url || ''}
          disabled={!url}
          tabIndex={!url ? -1 : undefined}
          variant="subtle"
        >
          {icon}
        </ActionIcon>
      </Box>
    </Tooltip>
  );
};

export default SessionInfo;
