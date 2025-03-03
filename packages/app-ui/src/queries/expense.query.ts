import { ApiClient } from '@rumsan/raman/clients';
import { Expense, ExpenseExtended } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';

//TODO: fix any
export const useExpenseList = (pagination: Pagination, filters: any): any => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  const query = useQuery(
    {
      queryKey: ['expense_list', { ...pagination, ...filters }],
      queryFn: async () => {
        console.log(filters);
        const { response } = await RsClient.Expense.search(pagination, filters);
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    },
    queryClient,
  );

  return query;
};

export const useAddExpense = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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

export const useApproveExpense = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();
  return useMutation(
    {
      mutationFn: async (payload: { id: string }) => {
        const { data } = await RsClient.Expense.approve(payload.id);
        return data;
      },
      onSuccess: (updatedExpense) => {
        queryClient?.invalidateQueries({
          queryKey: ['expense_list'],
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
