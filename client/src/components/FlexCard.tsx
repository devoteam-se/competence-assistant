import { Card, Group } from '@mantine/core';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

const FlexCard = ({ children }: Props) => {
  return (
    <Card withBorder radius="md">
      <Group position="apart" noWrap>
        {children}
      </Group>
    </Card>
  );
};

export default FlexCard;
