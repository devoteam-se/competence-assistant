import { Navbar, Avatar, Box, Group, Menu, Text, ScrollArea, Divider, NavLink, Stack, Title } from '@mantine/core';
import { useAuth } from '@/contexts/auth';
import { IconLogout2, IconPresentation, IconBulb, IconCalendar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useEvents } from '@/hooks/events';
import { Link, useLocation, useParams } from 'react-router-dom';
import { User } from '@competence-assistant/shared';
import { dateLong } from '@/utils/dates';

type Props = {
  open: boolean;
};

const Navigation = ({ open }: Props) => {
  const { t } = useTranslation('common', { keyPrefix: 'navigation' });
  const { events } = useEvents({
    initalFilter: { states: ['active'] },
  });
  const { currentUser } = useAuth();
  const { eventId } = useParams();
  const { pathname } = useLocation();

  const topLinks = [
    { label: t('sessions'), href: '/', icon: <IconPresentation /> },
    { label: t('wishes'), href: '/wishes', icon: <IconBulb /> },
  ];

  const eventLinks = events.data.map(({ id, name, startDate }) => ({
    label: name,
    description: dateLong(startDate),
    href: `/events/${id}`,
    icon: <IconCalendar />,
  }));

  const adminLinks = currentUser?.admin
    ? [
        { label: t('events'), href: '/admin/events' },
        { label: t('tracks'), href: '/admin/tracks' },
        { label: t('permissions'), href: '/admin/permissions' },
        { label: t('locations'), href: '/admin/locations' },
      ]
    : [];

  return (
    <Navbar p="md" hidden={!open} hiddenBreakpoint="xl" width={{ base: 300 }} withBorder>
      <Stack spacing="xs" justify="space-between" h="100%">
        <Navbar.Section grow={eventLinks.length === 0}>
          {topLinks.map(({ label, href, icon }) => (
            <NavLink key={href} label={label} icon={icon} active={href === pathname} component={Link} to={href} />
          ))}
        </Navbar.Section>

        {eventLinks.length > 0 && (
          <>
            <Title order={6} mt="xs">
              {t('events')}
            </Title>
            <Navbar.Section grow component={ScrollArea} scrollbarSize={5} type="auto">
              {eventLinks.map(({ label, description, href, icon }) => (
                <NavLink
                  key={href}
                  label={label}
                  description={description}
                  icon={icon}
                  active={!!eventId && href.includes(eventId)}
                  component={Link}
                  to={href}
                />
              ))}
            </Navbar.Section>
          </>
        )}

        {adminLinks.length > 0 && (
          <>
            <Title order={6} mt="xs">
              {t('admin')}
            </Title>
            <Navbar.Section>
              {adminLinks.map(({ label, href }) => (
                <NavLink key={href} label={label} active={href === pathname} component={Link} to={href} />
              ))}
            </Navbar.Section>
          </>
        )}

        {currentUser && (
          <>
            <Divider />
            <Navbar.Section>
              <UserMenu {...currentUser} />
            </Navbar.Section>
          </>
        )}
      </Stack>
    </Navbar>
  );
};

export default Navigation;

const UserMenu = ({ photoUrl, name, email }: User) => {
  const { signOut } = useAuth();
  const { t } = useTranslation('common', { keyPrefix: 'navigation' });

  return (
    <Menu position="top" withArrow width="target">
      <Menu.Target>
        <NavLink
          label={
            <Group noWrap>
              <Avatar radius="xl" src={photoUrl} />
              <Box>
                <Text size="sm">{name}</Text>
                <Text lineClamp={1} size="xs">
                  {email}
                </Text>
              </Box>
            </Group>
          }
        ></NavLink>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconLogout2 />} onClick={signOut}>
          {t('signOut')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
