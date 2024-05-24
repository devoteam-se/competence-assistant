import { HEIGHT as APP_HEADER_HEIGHT } from '@/components/AppShell/Header';
import useIsMobile from '@/hooks/isMobile';
import { px, rem, useMantineTheme } from '@mantine/core';
import { useLocation } from 'react-router-dom';

/**
 * Calculate available space for the calendar component.
 * This solutions feels a bit hacky, but it's the best I could come up with without messing with body and mantine appShell.
 *
 * The point of this hook is to hide the body scroll bar and make the calendar component itself scrollable.
 * And the reason for that is to make the room headers sticky while scrolling the calendar by using `CalendarOptions.stickyHeaderDates`.
 */
const useAvailableSpace = ({ tabsShown = false }: { tabsShown?: boolean } = {}) => {
  const { spacing } = useMantineTheme();
  const { pathname } = useLocation();
  const isAdmin = pathname.includes('admin');
  const isMobile = useIsMobile();

  const heights = [
    APP_HEADER_HEIGHT,
    2 * px(spacing.md), // appShell padding
    2 * px(spacing.md), // container padding
    isMobile ? 80 : 48, // page header height. On mobile, header actions will fold under the title, so account for the extra height
    px(spacing.xl), // Page stack spacing
    tabsShown ? 36 + px(spacing.xs) : 0, // tabs height + spacing
    !isAdmin ? 40 + px(spacing.xl) : 0, // account for the filter button height + spacing
  ];

  const taken = rem(heights.reduce((acc, val) => acc + val, 0));
  return `calc(100vh - ${taken})`;
};

export default useAvailableSpace;
