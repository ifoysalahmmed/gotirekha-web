import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

export const showDone = (message: string): void => {
  notifications.show({
    message,
    color: 'emerald',
    icon: <IconCheck size={18} aria-hidden />,
    autoClose: 4000,
  });
};

export const showFailed = (message: string): void => {
  notifications.show({
    message,
    color: 'danger',
    icon: <IconAlertCircle size={18} aria-hidden />,
    autoClose: false,
  });
};
