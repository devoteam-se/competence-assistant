import { Center, Loader } from '@mantine/core';

type LoadingIndicatorProps = {
  size?: number;
};

export const LoadingIndicator = ({ size = 100 }: LoadingIndicatorProps) => {
  return (
    <Center h="100vh">
      <Loader size={size} />
    </Center>
  );
};
