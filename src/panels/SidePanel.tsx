import { Box, Divider, Drawer, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';

import { t } from '../texts/t.js';

interface SidePanelProps {
  opened: boolean;
  onClose: () => void;
  onClosed?: () => void;
  title: string;
  footer?: ReactNode;
  locked?: boolean;
  guarded?: boolean;
  children: ReactNode;
}

const PANEL_WIDTH = 440;

const SHEET_MOTION_MS = 240;

export const SidePanel = ({
  opened,
  onClose,
  onClosed,
  title,
  footer,
  locked = false,
  guarded = false,
  children,
}: SidePanelProps) => {
  const phone = useMediaQuery('(max-width: 47.99em)');

  return (
    <Drawer.Root
      opened={opened}
      onClose={onClose}
      onExitTransitionEnd={() => {
        onClosed?.();
      }}
      position="right"
      transitionProps={{
        duration: SHEET_MOTION_MS,
      }}
      size={phone ? '100%' : PANEL_WIDTH}
      closeOnClickOutside={!locked && !guarded}
      closeOnEscape={!locked}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        },
      }}
    >
      <Drawer.Overlay backgroundOpacity={0.32} />
      <Drawer.Content>
        <Drawer.Header px="lg" pt="lg" pb="md">
          <Drawer.Title fz={22} fw={600} lh="30px">
            {title}
          </Drawer.Title>
          <Drawer.CloseButton size={40} aria-label={t('common.close')} />
        </Drawer.Header>

        <Drawer.Body px="lg" pt={4} pb="lg">
          {children}
        </Drawer.Body>

        {footer === undefined ? null : (
          <Box>
            <Divider color="gray.1" />
            <Group px="lg" py="md" gap="sm" grow>
              {footer}
            </Group>
          </Box>
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
};
