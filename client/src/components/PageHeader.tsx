import { Group, Title, Text, Button, ButtonProps, Skeleton, Divider, Stack, rem } from '@mantine/core';

type Action = {
  label: string;
  icon?: ButtonProps['leftIcon'];
  onClick?: () => void;
  component?: any; // mantine polymorphic component, not sure how to properly type this. used in pages/event/index.ts
  to?: string;
  variant?: ButtonProps['variant'];
  disabled?: ButtonProps['disabled'];
};
type Props = {
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  actions?: Action[];
  banner?: React.ReactNode;
};

const HEIGHT = 36;
const PageHeader = ({ title, subtitle, actions, banner, isLoading }: Props) => {
  if (isLoading)
    return (
      <Stack spacing="xs">
        <Skeleton height={rem(HEIGHT)} />
        <Divider size="sm" color="gray.8" />
      </Stack>
    );

  return (
    <Stack spacing="xs">
      <Group position="apart" spacing="xs" mih={rem(HEIGHT)}>
        <Group align="baseline">
          <Title size={rem(26)} order={1} inline>
            {title}
          </Title>
          {subtitle && (
            <Text size={rem(22)} span inline>
              {subtitle}
            </Text>
          )}
        </Group>
        {banner}
        {actions && actions.length > 0 && (
          <Group>
            {actions.map((action) => (
              <Button key={action.label} radius="xl" leftIcon={action.icon} {...action}>
                {action.label}
              </Button>
            ))}
          </Group>
        )}
      </Group>
      <Divider size="sm" color="gray.8" />
    </Stack>
  );
};

export default PageHeader;
