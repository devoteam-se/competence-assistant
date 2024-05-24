import { useQuery } from '@tanstack/react-query';

import Api from '@/api';
import { EventFilter, EventOrder } from '@competence-assistant/shared';
import { useCallback, useMemo, useState } from 'react';

type Pagination = { page: number; count?: number };
type Props = {
  initalFilter?: EventFilter;
  pagination?: Pagination;
  initialOrder?: EventOrder;
  enabled?: boolean;
};
export type ApplyFilter = <K extends keyof EventFilter>(key: K, values: EventFilter[K]) => void;

const defaultPagination = { page: 1, count: 9 };
const defaultFilter = { states: [] };

export const useEvents = ({
  initalFilter = defaultFilter,
  pagination = defaultPagination,
  initialOrder = EventOrder.Newest,
  enabled = true,
}: Props = {}) => {
  const { count, page } = { ...defaultPagination, ...pagination };

  const [order, setOrder] = useState<EventOrder>(initialOrder);
  const [paging, setPaging] = useState({ limit: count, offset: (page - 1) * count });
  const [filter, setFilter] = useState(initalFilter);

  const query = useQuery({
    queryKey: ['events', { filter, paging, order }],
    queryFn: () => Api.getEvents({ filter, paging, order }),
    staleTime: Infinity,
    enabled,
  });

  const clearFilter = useCallback(() => setFilter(defaultFilter), [setFilter]);
  const applyFilter: ApplyFilter = useCallback(
    (key, values) => setFilter((prevState) => ({ ...prevState, [key]: values })),
    [],
  );

  const hasFilter = useMemo(() => !!filter.states && filter.states.length > 0, [filter]);

  const totalPages = query.data ? Math.ceil(query.data.total / query.data.limit) : 0;
  const activePage = query.data ? query.data.offset / query.data.limit + 1 : 1;
  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPaging({ limit: count, offset: (page - 1) * count });
  };

  return {
    events: { ...query, data: query.data?.events ?? [] },
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
    sort: {
      active: order,
      apply: setOrder,
      hasSort: order !== initialOrder,
    },
  };
};

export const useEvent = (id?: string | null) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => Api.getEvent(id!),
    staleTime: Infinity,
    enabled: !!id,
  });
};
