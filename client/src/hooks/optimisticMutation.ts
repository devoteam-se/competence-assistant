import { sendNotification } from '@/utils/notifications';
import { MutationFunction, QueryKey, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

/**
 *Mutates with optimistic update to the cache
 *@param func API function
 *@param queryKey query cache key
 *@param updater update function used to optimistically mutate the cache
 *@param options react-query mutation option object
 */
export const useOptimisticMutation = <TData = unknown, TError = Error, TVariables = void, TContext = TData>(
  func: MutationFunction<TData, TVariables>,
  queryKey: QueryKey,
  updater: (oldData: TContext | undefined, newData: TVariables) => TContext | undefined,
  { onSuccess, onError, ...options }: UseMutationOptions<TData, TError, TVariables, unknown> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: func,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<TContext>(queryKey, (oldData) => updater(oldData, data as TVariables));

      return previousData;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context as TContext);
      if (err instanceof Error) {
        sendNotification({ status: 'FAIL', message: err.message });
      }
      onError?.(err, variables, context);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.(data, variables, context);
    },
  });
};
