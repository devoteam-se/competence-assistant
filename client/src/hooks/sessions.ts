import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SessionOrder, SessionFilter } from '@competence-assistant/shared';
import Api from '@/api';

type Pagination = { page: number; count?: number };
type Props = {
  initialOrder?: SessionOrder;
  initalFilter?: SessionFilter;
  pagination?: Pagination;
  eventId?: string;
  enabled?: boolean;
};
export type ApplyFilter = <K extends keyof SessionFilter>(key: K, values: SessionFilter[K]) => void;

const defaultFilter: SessionFilter = {
  tracks: [],
  types: [],
  events: [],
  levels: [],
  votedBy: undefined,
  favouritedBy: undefined,
  hostedBy: undefined,
  votable: false,
};
const defaultPagination = { page: 1, count: 27 };

export const useSessions = ({
  initalFilter = defaultFilter,
  pagination = defaultPagination,
  initialOrder = SessionOrder.Name,
  enabled = true,
  eventId,
}: Props) => {
  const { count, page } = { ...defaultPagination, ...pagination };

  const [orderBy, setOrderBy] = useState<SessionOrder>(initialOrder);
  const [paging, setPaging] = useState({ limit: count, offset: (page - 1) * count });
  const [filter, setFilter] = useState(initalFilter);

  useEffect(() => {
    if (eventId) {
      setFilter((prev) => ({ ...prev, events: [eventId] }));
    }
  }, [eventId]);

  const query = useQuery({
    queryKey: ['sessions', { filter, paging, orderBy }],
    queryFn: () => Api.getSessions({ filter, paging, orderBy }),
    staleTime: Infinity,
    enabled,
  });

  const clearFilter = useCallback(() => setFilter(defaultFilter), [setFilter]);
  const applyFilter: ApplyFilter = useCallback(
    (key, values) => setFilter((prevState) => ({ ...prevState, [key]: values })),
    [],
  );

  const hasFilter = useMemo(() => {
    const empty = eventId ? { ...initalFilter, events: [eventId] } : initalFilter;
    return Object.keys(defaultFilter).some((key) => {
      const value = filter[key as keyof SessionFilter];
      const initial = empty[key as keyof SessionFilter];

      if (Array.isArray(value) && Array.isArray(initial)) {
        const values = new Set(value);
        const initials = new Set(initial);
        return values.size !== initials.size || [...values].some((v) => !initials.has(v));
      }

      return value !== initial;
    });
  }, [eventId, initalFilter, filter]);

  const totalPages = query.data ? Math.ceil(query.data.total / query.data.limit) : 0;
  const activePage = query.data ? query.data.offset / query.data.limit + 1 : 1;
  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPaging({ limit: count, offset: (page - 1) * count });
  };

  return {
    sessions: { ...query, data: query.data?.sessions ?? [] },
    sort: {
      active: orderBy,
      apply: setOrderBy,
      hasSort: orderBy !== initialOrder,
    },
    filter: {
      active: filter,
      apply: applyFilter,
      clear: clearFilter,
      hasFilter,
    },
    pagination: {
      totalPages,
      activePage,
      onChange: onPageChange,
    },
  };
};

export const useEventSessions = (eventId?: string) => {
  const { sessions, filter } = useSessions({
    initalFilter: { events: eventId ? [eventId] : [] },
    pagination: { page: 1, count: 100 },
    enabled: !!eventId,
  });

  return { sessions, filter };
};

export const useSession = (id?: string) => {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => Api.getSession(id!),
    staleTime: Infinity,
    enabled: !!id,
  });
};
