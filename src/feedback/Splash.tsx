import { Center, Loader, Stack } from '@mantine/core';

import { LogoMark } from '../brand/Logo.js';
import { t } from '../texts/t.js';

export const Splash = () => (
  <Center mih="100dvh" role="status" aria-label={t('common.loading')}>
    <Stack align="center" gap="lg">
      <LogoMark size={48} />
      <Loader size="sm" type="dots" />
    </Stack>
  </Center>
);
