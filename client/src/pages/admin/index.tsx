import { Stack } from '@mantine/core';
import { Outlet } from 'react-router-dom';

const PageAdmin = () => {
  return (
    <Stack spacing="xl">
      <Outlet />
    </Stack>
  );
};

export default PageAdmin;
