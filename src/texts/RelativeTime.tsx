import { Box, Tooltip } from '@mantine/core';

import { formatFullTime, formatRelativeTime } from './format.js';

interface RelativeTimeProps {
  value: string;
}

export const RelativeTime = ({ value }: RelativeTimeProps) => (
  <Tooltip label={formatFullTime(value)} withArrow openDelay={300}>
    <Box component="time" dateTime={value}>
      {formatRelativeTime(value)}
    </Box>
  </Tooltip>
);
