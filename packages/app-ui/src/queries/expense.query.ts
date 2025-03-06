import { ApiClient } from '@rumsan/raman/clients';
import { Expense, ExpenseExtended } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from './query.client';

const booleanFilters = (filters: any, field: string) => {
  let filterField = filters[field];
  if (filterField) {
    if (typeof filterField === 'string') filterField = [filterField];

    if (filterField.indexOf('true') > -1 && filterField.indexOf('false') > -1)
      delete filters[field];
    else if (filterField.indexOf('true') > -1) filters[field] = true;
    else filters[field] = false;
  }
  return filters;
};

//TODO: fix any
export const useExpenseList = (
  pagination: Pagination,
  filters: any,
): UseQueryResult<
  {
    data: Expense[];
    meta: any;
  },
  Error
> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['expense_list', { ...pagination, ...filters }],
      queryFn: async () => {
        filters = booleanFilters(filters, 'isVerified');
        filters = booleanFilters(filters, 'isReconciled');

        const { response } = await RsClient.Expense.search(pagination, filters);
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    },
    queryClient,
  );
};

export const useAddExpense = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: any) => {
        const { data } = await RsClient.Expense.create(payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return data;
      },
      onSuccess: (newExpense) => {
        queryClient?.setQueryData<Expense[]>(
          ['expense_list'],
          (oldData = []) => {
            return [newExpense, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useUploadAttachments = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { cuid: string; data: any }) => {
        const { data } = await RsClient.Expense.uploadAttachments(
          payload.cuid,
          payload.data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return data;
      },
      onSuccess: (updatedExpense) => {
        queryClient?.invalidateQueries({
          queryKey: ['expense_get'],
        });
        queryClient?.setQueryData<Expense[]>(
          ['expense_list'],
          (oldData = []) => {
            return oldData.map((expense) =>
              expense.cuid === updatedExpense.cuid ? updatedExpense : expense,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useDeleteAttachment = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; attachmentId: string }) => {
        const { data } = await RsClient.Expense.deleteAttachment(
          payload.id,
          payload.attachmentId,
        );
        return data;
      },
      onSuccess: (updatedExpense) => {
        queryClient?.invalidateQueries({
          queryKey: ['expense_get'],
        });
      },
    },
    queryClient,
  );
};

export const useEditExpense = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: any }) => {
        const { data } = await RsClient.Expense.update(
          payload.id,
          payload.data,
        );
        return data;
      },
      onSuccess: (updatedExpense) => {
        queryClient?.invalidateQueries({
          queryKey: ['expense_get'],
        });
        queryClient?.setQueryData<Expense[]>(
          ['expense_list'],
          (oldData = []) => {
            return oldData.map((expense) =>
              expense.cuid === updatedExpense.cuid ? updatedExpense : expense,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useExpenseById = (
  expenseId: string,
): UseQueryResult<ExpenseExtended, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['expense_get', expenseId],
      queryFn: async () => {
        const { data } = await RsClient.Expense.get(expenseId);
        return data;
      },
      enabled: !!expenseId, // Ensures query only runs if expenseId is truthy
    },
    queryClient,
  );
};

export const useVerifyExpense = () => {
  const { RsClient } = useRumsan<ApiClient>();
  return useMutation(
    {
      mutationFn: async (payload: { id: string }) => {
        const { data } = await RsClient.Expense.verify(payload.id);
        return data;
      },
      onSuccess: (updatedExpense) => {
        queryClient?.invalidateQueries({
          queryKey: ['expense_list', 'expense_get'],
        });
        queryClient?.setQueryData<Expense[]>(
          ['expense_list'],
          (oldData = []) => {
            return oldData.map((expense) =>
              expense.cuid === updatedExpense.cuid ? updatedExpense : expense,
            );
          },
        );
      },
    },
    queryClient,
  );
};
