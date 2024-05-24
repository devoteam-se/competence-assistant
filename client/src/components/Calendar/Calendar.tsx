import { useEvent } from '@/hooks/events';
import useIsMobile from '@/hooks/isMobile';
import { useSchedule, BreakEventSource, CalendarEventType, SessionEventSource } from '@/hooks/schedule';
import { openModal } from '@/utils/openModal';
import FullCalendar, { type CalendarOptions, type EventClickArg } from '@fullcalendar/react'; // must go before plugins
import resourceTimeGrid from '@fullcalendar/resource-timegrid'; // premium plugin
import interaction from '@fullcalendar/interaction';
import { Box, ScrollArea, Stack, rem } from '@mantine/core';
import dayjs from 'dayjs';
import React, { forwardRef, useState } from 'react';
import SessionModal from '../Session/SessionModal';
import './calendar.css';
import CalendarEvent from './CalendarEvent';
import DateTabs from './DateTabs';
import useAvailableSpace from './useAvailableSpace';

type Props = Omit<CalendarOptions, 'plugins'> & {
  eventId: string;
  calendarEvents: (SessionEventSource | BreakEventSource)[];
  showHelpers?: boolean;
};

const defaultOpts: CalendarOptions = {
  headerToolbar: false,
  snapDuration: '00:05',
  nowIndicator: true,
  allDaySlot: false,
  expandRows: true,
  handleWindowResize: true,
  stickyHeaderDates: true,
  schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
  slotMinTime: '08:00:00',
  slotMaxTime: '18:00:00',
  height: '100%',
  contentHeight: 'auto',
  dragRevertDuration: 0,
  initialView: 'resourceTimeGrid',
  plugins: [resourceTimeGrid, interaction],
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  },
};

const Calendar = forwardRef(
  ({ eventId, calendarEvents, showHelpers = false, ...props }: Props, ref: React.Ref<FullCalendar>) => {
    const isMobile = useIsMobile();
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    const { rooms } = useSchedule(eventId);
    const { data: event } = useEvent(eventId);

    const diff = dayjs(event?.endDate).diff(event?.startDate, 'day');
    const dates = Array.from({ length: diff + 1 }).map((_, i) => dayjs(event?.startDate).add(i, 'day').toISOString());
    const availableSpace = useAvailableSpace({ tabsShown: dates.length > 1 });

    if (!event) return null;

    const onCalendarEventClick = (args: EventClickArg) => {
      if (args.event.extendedProps.type !== CalendarEventType.SESSION) return;

      openModal({
        fullScreen: isMobile,
        title: args.event.title,
        children: <SessionModal sessionId={args.event.extendedProps.sessionId} event={event} />,
      });
    };

    return (
      <Stack spacing="xs">
        {dates.length > 1 && <DateTabs dates={dates} value={selectedDate} onChange={setSelectedDate} />}

        <ScrollArea type="auto" offsetScrollbars>
          <Box miw={rem(rooms.length * 150)} mah={availableSpace}>
            <FullCalendar
              ref={ref}
              initialDate={event.startDate}
              eventSources={[calendarEvents.map((e) => ({ ...e, classNames: e.status ? [e.status] : [] }))]}
              resources={rooms.map(({ id, name }) => ({ id, title: name }))}
              eventContent={(args) => <CalendarEvent args={args} showHelpers={showHelpers} />}
              validRange={{ start: selectedDate, end: selectedDate }}
              eventClick={onCalendarEventClick}
              {...defaultOpts}
              {...props}
            />
          </Box>
        </ScrollArea>
      </Stack>
    );
  },
);

Calendar.displayName = 'Calendar';

export default Calendar;
