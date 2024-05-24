import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export const nowIsAfter = (date: string) => {
  const now = dayjs();

  return dayjs(now).isAfter(date);
};

export const nowIsBefore = (date: string) => {
  const now = dayjs();

  return dayjs(now).isBefore(date);
};

export const dateLong = (date: string) => {
  return dayjs(date).format('LL');
};

export const dateShort = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD');
};
