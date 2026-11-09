import { Box, Center, Flex, Group, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

import { LogoFull, LogoRoad } from '../brand/Logo.js';

interface AuthLayoutProps {
  brand: string;
  area: string;
  title: string;
  text: string;
  children: ReactNode;
}

export const AuthLayout = ({
  brand,
  area,
  title,
  text,
  children,
}: AuthLayoutProps) => (
  <Flex
    mih="100dvh"
    direction={{
      base: 'column',
      md: 'row',
    }}
  >
    <Stack
      flex={1}
      pos="relative"
      justify="space-between"
      gap={24}
      px={{
        base: 'md',
        md: 48,
      }}
      py={{
        base: 'lg',
        md: 48,
      }}
      bg="emerald.6"
      c="white"
      style={{
        overflow: 'hidden',
      }}
    >
      <Box
        pos="absolute"
        right={{
          base: -120,
          md: -220,
        }}
        bottom={{
          base: -170,
          md: -240,
        }}
        w={{
          base: 380,
          md: 720,
        }}
        h={{
          base: 380,
          md: 720,
        }}
      >
        <LogoRoad />
      </Box>

      <Group gap={14} pos="relative" wrap="nowrap">
        <LogoFull size={52} />
        <Stack gap={0}>
          <Text fz={24} fw={600} lh="30px" lts="-0.02em">
            {brand}
          </Text>
          <Text
            fz="xs"
            fw={600}
            lh="16px"
            lts="0.1em"
            tt="uppercase"
            c="emerald.1"
          >
            {area}
          </Text>
        </Stack>
      </Group>

      <Stack gap={10} maw={420} pos="relative">
        <Text
          fz={{
            base: 24,
            md: 32,
          }}
          lh={{
            base: '32px',
            md: '40px',
          }}
          fw={600}
          lts="-0.025em"
        >
          {title}
        </Text>
        <Text
          fz={{
            base: 'sm',
            md: 'md',
          }}
          c="emerald.0"
        >
          {text}
        </Text>
      </Stack>
    </Stack>

    <Center
      component="main"
      flex={1}
      px={{
        base: 'md',
        md: 'lg',
      }}
      py={{
        base: 'xl',
        md: 48,
      }}
    >
      {children}
    </Center>
  </Flex>
);
