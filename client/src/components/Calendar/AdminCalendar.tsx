import { useBreakMutations } from '@/hooks/breakMutations';
import { useSchedule, CalendarEventType } from '@/hooks/schedule';
import { useScheduleMutations } from '@/hooks/scheduleMutations';
import FullCalendar, { type EventApi } from '@fullcalendar/react'; // must go before plugins
import { Box } from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useRef } from 'react';
import { ScheduleSessionDataSet } from '../Schedule/ScheduleSession';
import Calendar from './Calendar';
import { Event } from '@competence-assistant/shared';

const getAddPayload = (e: ScheduleSessionDataSet, startDateStr: string, resourceId: string, eventId: string) => {
  const duration = parseInt(e.duration, 10);
  return {
    sessionId: e.id,
    eventId: eventId,
    start: startDateStr,
    end: dayjs(startDateStr).add(duration, 'm').format(),
    roomId: resourceId,
  };
};

const getAddBreakPayload = ({ id, title, duration }: ScheduleSessionDataSet, startDateStr: string, eventId: string) => {
  if (!title) {
    throw new Error('No title in draggable dataSet');
  }

  return {
    id,
    start: startDateStr,
    end: dayjs(startDateStr).add(parseInt(duration, 10), 'm').format(),
    title,
    eventId,
  };
};

const isOutside = (dropArea: HTMLDivElement, { clientX, clientY }: MouseEvent) => {
  const { left, right, top, bottom } = dropArea.getBoundingClientRect();
  return clientX < left || clientX > right || clientY < top || clientY > bottom;
};

const AdminCalendar = ({ event }: { event: Event }) => {
  const { removeScheduleSession, editScheduleSession, createScheduleSession } = useScheduleMutations(event.id);
  const { editScheduleBreak, removeScheduleBreak, createScheduleBreak } = useBreakMutations(event.id);

  const { sessions, breaks } = useSchedule(event.id, { includeConflicts: true });

  const calendarRef = useRef<FullCalendar>(null);
  const dropArea = useRef<HTMLDivElement>(null);
  const isPastEvent = dayjs(event.endDate).isBefore(dayjs());

  const onAdd = (e: ScheduleSessionDataSet, startDateStr: string, resourceId?: string) => {
    if (!resourceId) return;
    if (e.type === CalendarEventType.BREAK) {
      return createScheduleBreak(getAddBreakPayload(e, startDateStr, event.id));
    }
    createScheduleSession(getAddPayload(e, startDateStr, resourceId, event.id));
  };

  const onEventEdit = useCallback(
    ({ id, startStr, endStr, title, extendedProps }: EventApi, resourceId?: string) => {
      if (extendedProps.type === CalendarEventType.BREAK) {
        return editScheduleBreak({ id, title, start: startStr, end: endStr, eventId: event.id });
      }
      editScheduleSession({
        sessionId: extendedProps.sessionId,
        start: startStr,
        end: endStr,
        roomId: resourceId || extendedProps.roomId,
        eventId: event.id,
      });
    },
    [editScheduleBreak, editScheduleSession, event.id],
  );

  const onDragStop = (evt: EventApi, mouseEvent: MouseEvent) => {
    if (!dropArea.current || !isOutside(dropArea.current, mouseEvent)) return;
    if (evt.extendedProps.type === CalendarEventType.BREAK) {
      return removeScheduleBreak({ id: evt.id, eventId: event.id });
    }
    removeScheduleSession({ sessionId: evt.extendedProps.sessionId, eventId: event.id });
  };

  return (
    <Box h="100%" ref={dropArea}>
      <Calendar
        ref={calendarRef}
        eventId={event.id}
        calendarEvents={[...sessions, ...breaks]}
        showHelpers
        editable={!isPastEvent}
        droppable={!isPastEvent}
        eventDrop={(info) => onEventEdit(info.event, info.newResource?.id)}
        eventDragStop={({ event: evt, jsEvent }) => onDragStop(evt, jsEvent)}
        eventResize={({ event }) => onEventEdit(event)}
        drop={({ draggedEl, dateStr, resource }) =>
          onAdd(draggedEl.dataset as ScheduleSessionDataSet, dateStr, resource?.id)
        }
      />
    </Box>
  );
};

export default AdminCalendar;
