import { ActionIcon, ActionIconProps } from '@mantine/core';
import React from 'react';

export type Props = ActionIconProps & React.HTMLAttributes<HTMLButtonElement>;

const IconButton = React.forwardRef(({ children, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  return (
    <ActionIcon variant="subtle" radius="xl" size="lg" color="dark" {...rest} ref={ref}>
      {children}
    </ActionIcon>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
