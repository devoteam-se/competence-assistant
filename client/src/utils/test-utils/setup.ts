import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

vi.mock('@/api/method.ts', async () => {
  return {
    get: (url: string, values: any) => ({ url, values }),
    post: (url: string, values: any) => ({
      url,
      values,
    }),
    put: (url: string, values: any) => ({ url, values }),
    _delete: (url: string, values: any) => ({ url, values }),
  };
});

vi.mock('@/firebase', () => {
  return {
    firebase: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      auth: vi.fn(),
    },
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
