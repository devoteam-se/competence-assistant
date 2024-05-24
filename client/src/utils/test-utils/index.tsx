import { render } from '@testing-library/react';
import { vi } from 'vitest';
import ThemeProvider from '@/contexts/ThemeProvider';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/auth';

import { mockUser } from './mockFunctions';

const mockAuthContextValue = {
  currentUser: mockUser('1', { admin: true }),
  signIn: vi.fn(),
  signOut: vi.fn(),
};

export const renderWithProviders = (children: React.ReactNode) => {
  const queryClient = new QueryClient();

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={mockAuthContextValue}>
            <ModalsProvider>
              <Notifications />
              <BrowserRouter>{children}</BrowserRouter>
            </ModalsProvider>
          </AuthContext.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  };

  return render(children, { wrapper: AllTheProviders });
};
