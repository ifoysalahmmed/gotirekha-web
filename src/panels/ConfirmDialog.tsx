import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { t } from '../texts/t.js';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onClosed?: () => void;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  tone?: 'default' | 'danger';
  working: boolean;
  error: string | null;
  onConfirm: () => void;
  result?: ReactNode;
}

export const ConfirmDialog = ({
  opened,
  onClose,
  onClosed,
  title,
  message,
  confirmLabel,
  tone = 'default',
  working,
  error,
  onConfirm,
  result,
}: ConfirmDialogProps) => {
  const showingResult = result !== undefined && result !== null;
  const closable = !working && !showingResult;

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!working) {
          onClose();
        }
      }}
      onExitTransitionEnd={() => {
        onClosed?.();
      }}
      title={title}
      closeOnEscape={closable}
      closeOnClickOutside={closable}
      withCloseButton={!working}
      closeButtonProps={{
        'aria-label': t('common.close'),
      }}
    >
      {showingResult ? (
        result
      ) : (
        <Stack gap="md">
          {error === null ? null : (
            <Alert
              color="danger"
              icon={<IconAlertCircle size={20} aria-hidden />}
            >
              {error}
            </Alert>
          )}

          <Stack gap="xs" fz="md" c="gray.7">
            {typeof message === 'string' ? <Text>{message}</Text> : message}
          </Stack>

          <Group justify="flex-end" gap="sm" mt="xs">
            <Button
              variant="default"
              onClick={onClose}
              disabled={working}
              data-autofocus
            >
              {t('common.cancel')}
            </Button>
            <Button
              color={tone === 'danger' ? 'danger' : 'emerald'}
              loading={working}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
