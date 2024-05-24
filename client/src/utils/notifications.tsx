import { showNotification } from '@mantine/notifications';
import { IconX, IconCheck, IconInfoSmall } from '@tabler/icons-react';

const notificationTypes = {
  SUCCESS: { color: 'green', icon: <IconCheck /> },
  INFO: { color: 'blue', icon: <IconInfoSmall /> },
  FAIL: { color: 'red', icon: <IconX /> },
} as const;

export type NotificationStatus = keyof typeof notificationTypes;

export type NotificationParams = {
  message: string;
  title?: string;
  status: NotificationStatus;
};

export const sendNotification = (params: NotificationParams) => {
  const { message, status, title } = params;
  return showNotification({
    message: message,
    title: title,
    color: notificationTypes[status].color,
    icon: notificationTypes[status].icon,
  });
};
