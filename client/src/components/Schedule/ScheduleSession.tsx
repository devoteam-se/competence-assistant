import React, { memo, useEffect, useRef } from 'react';
import { Draggable } from '@fullcalendar/interaction';
import ScheduleSessionCard from './ScheduleSessionCard';
import { CalendarEventType } from '@/hooks/schedule';

type Props = {
  id: string;
  name: string;
  color: string;
  duration: number;
  type: CalendarEventType;
  children?: React.ReactNode;
};

export type ScheduleSessionDataSet = {
  id: string;
  type: CalendarEventType;
  duration: string;
  title?: string;
};

const ScheduleSession = memo(({ ...props }: Props) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    const draggable = new Draggable(elRef.current, {
      itemSelector: '.fc-event',
      eventData: function (eventEl) {
        const title = eventEl.getAttribute('title');
        const id = eventEl.getAttribute('data-id');

        return { create: false, id, title, duration: { minute: props.duration } };
      },
    });
    return () => draggable.destroy();
  }, [props.duration]);

  return (
    <ScheduleSessionCard ref={elRef} {...props}>
      {props.children}
    </ScheduleSessionCard>
  );
});

ScheduleSession.displayName = 'ScheduleSession';

export default ScheduleSession;
