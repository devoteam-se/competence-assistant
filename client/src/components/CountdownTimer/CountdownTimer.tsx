import { Text, TextProps } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
dayjs.extend(relativeTime);
dayjs.extend(duration);

type Props = Omit<TextProps, 'children'> & {
  endDate: string;
  prefix?: string;
};

type Time = {
  days: number;
  hours: number;
  minutes: number;
};

/**
 * Returns days, hours and minutes between now and endDate
 *  */
export const getTimeLeft = (endDate: string): Time => {
  const now = dayjs();
  const end = dayjs(endDate);
  const days = end.diff(now, 'days');
  const hours = end.diff(now.add(days, 'days'), 'hours');
  const minutes = end.diff(now.add(days, 'days').add(hours, 'hours'), 'minutes');

  return {
    days,
    hours,
    minutes,
  };
};

const formatTime = (time: Time) => {
  const { days, hours, minutes } = time;
  if (days === 0 && hours === 0 && minutes === 0) return '0m';
  if (days === 0 && hours === 0) return `${minutes}m`;
  if (days === 0) return `${hours}h ${minutes}m`;
  return `${days}d ${hours}h ${minutes}m`;
};

const CountdownTimer = ({ endDate, prefix, ...textProps }: Props) => {
  const [time, setTime] = useState<string>(formatTime(getTimeLeft(endDate)));

  useEffect(() => {
    let interval = setInterval(() => {
      setTime(formatTime(getTimeLeft(endDate)));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return <Text {...textProps}>{`${prefix}${time}`}</Text>;
};

export default CountdownTimer;
