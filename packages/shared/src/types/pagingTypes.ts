import { z } from 'zod';
import { PagingValidator } from '../validators';

// Outgoing pagination
export type Page = {
  total: number;
  limit: number;
  offset: number;
};

// Incoming pagination
export type Paging = z.infer<typeof PagingValidator>;
