import { ScrollArea, Tabs, TabsValue, rem } from '@mantine/core';
import dayjs from 'dayjs';

type Props = {
  dates: string[];
  value: string | undefined;
  onChange: (date: string | undefined) => void;
};
const DateTabs = ({ dates, value, onChange }: Props) => {
  if (!dates.length) return null;

  const onTabChange = (date: TabsValue) => {
    onChange(date ?? undefined);
  };

  return (
    <ScrollArea scrollbarSize={rem(4)}>
      <Tabs value={value || dates[0]} onTabChange={onTabChange}>
        <Tabs.List sx={{ flexWrap: 'nowrap' }}>
          {dates.map((date) => (
            <Tabs.Tab fw={500} key={date} value={date}>
              {dayjs(date).format('dd DD/MM')}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </ScrollArea>
  );
};

export default DateTabs;
