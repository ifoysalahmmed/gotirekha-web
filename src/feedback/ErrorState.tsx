import { Button, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorStateProps {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
  headingOrder?: 1 | 2;
}

export const ErrorState = ({
  title,
  text,
  actionLabel,
  onAction,
  headingOrder = 1,
}: ErrorStateProps) => (
  <Stack align="center" gap="sm" py="xl" ta="center" role="alert">
    <ThemeIcon variant="light" color="danger" size={48} radius="xl">
      <IconAlertCircle size={24} aria-hidden />
    </ThemeIcon>
    <Title order={headingOrder} size="h3">
      {title}
    </Title>
    <Text c="dimmed" maw={420}>
      {text}
    </Text>
    <Button
      variant="default"
      leftSection={<IconRefresh size={16} aria-hidden />}
      onClick={onAction}
    >
      {actionLabel}
    </Button>
  </Stack>
);
