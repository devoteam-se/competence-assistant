import { useBreakMutations } from '@/hooks/breakMutations';
import { useSchedule, CalendarEventType } from '@/hooks/schedule';
import { useScheduleMutations } from '@/hooks/scheduleMutations';
import FullCalendar, { type EventApi } from '@fullcalendar/react'; // must go before plugins
import { Box } from '@mantine/core';
import dayjs from 'dayjs';
import { useCallback, useRef } from 'react';
import { ScheduleSessionDataSet } from '../Schedule/ScheduleSession';
import Calendar from './Calendar';

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

const AdminCalendar = ({ eventId, disabled = false }: { eventId: string; disabled?: boolean }) => {
  const { removeScheduleSession, editScheduleSession, createScheduleSession } = useScheduleMutations(eventId);
  const { editScheduleBreak, removeScheduleBreak, createScheduleBreak } = useBreakMutations(eventId);

  const { sessions, breaks } = useSchedule(eventId, { includeConflicts: true });

  const calendarRef = useRef<FullCalendar>(null);
  const dropArea = useRef<HTMLDivElement>(null);

  const onAdd = (e: ScheduleSessionDataSet, startDateStr: string, resourceId?: string) => {
    if (!resourceId) return;
    if (e.type === CalendarEventType.BREAK) {
      return createScheduleBreak(getAddBreakPayload(e, startDateStr, eventId));
    }
    createScheduleSession(getAddPayload(e, startDateStr, resourceId, eventId));
  };

  const onEventEdit = useCallback(
    ({ id, startStr, endStr, title, extendedProps }: EventApi, resourceId?: string) => {
      if (extendedProps.type === CalendarEventType.BREAK) {
        return editScheduleBreak({ id, title, start: startStr, end: endStr, eventId });
      }
      editScheduleSession({
        sessionId: extendedProps.sessionId,
        start: startStr,
        end: endStr,
        roomId: resourceId || extendedProps.roomId,
        eventId,
      });
    },
    [editScheduleBreak, editScheduleSession, eventId],
  );

  const onDragStop = (evt: EventApi, mouseEvent: MouseEvent) => {
    if (!dropArea.current || !isOutside(dropArea.current, mouseEvent)) return;
    if (evt.extendedProps.type === CalendarEventType.BREAK) {
      return removeScheduleBreak({ id: evt.id, eventId });
    }
    removeScheduleSession({ sessionId: evt.extendedProps.sessionId, eventId });
  };

  return (
    <Box h="100%" ref={dropArea}>
      <Calendar
        ref={calendarRef}
        eventId={eventId}
        calendarEvents={[...sessions, ...breaks]}
        showHelpers
        editable={!disabled}
        droppable={!disabled}
        eventDrop={({ event, newResource }) => onEventEdit(event, newResource?.id)}
        eventDragStop={({ event, jsEvent }) => onDragStop(event, jsEvent)}
        eventResize={({ event }) => onEventEdit(event)}
        drop={({ draggedEl, dateStr, resource }) =>
          onAdd(draggedEl.dataset as ScheduleSessionDataSet, dateStr, resource?.id)
        }
      />
    </Box>
  );
};

export default AdminCalendar;
