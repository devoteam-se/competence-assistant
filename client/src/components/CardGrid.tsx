import * as React from 'react';
import { SimpleGrid, SimpleGridBreakpoint, Skeleton, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

type Props = {
  children: React.ReactNode;
  isLoading?: boolean;
  emptyText?: string;
  cardSize?: 'sm' | 'md';
};

const breakpoints: SimpleGridBreakpoint[] = [
  { minWidth: 'sm', cols: 2 },
  { minWidth: 'lg', cols: 3 },
];

const CardGrid = ({ children, isLoading, emptyText, cardSize = 'md' }: Props) => {
  const { t } = useTranslation('common');

  if (!isLoading && React.Children.count(children) === 0) {
    return (
      <Text align="center" mt="xl">
        {emptyText || t('empty')}
      </Text>
    );
  }

  return (
    <SimpleGrid breakpoints={breakpoints}>
      {isLoading && [1, 2, 3].map((i) => <Skeleton key={i} radius="md" h={cardSize === 'sm' ? '5rem' : '24rem'} />)}
      {!isLoading && children}
    </SimpleGrid>
  );
};

export default CardGrid;
