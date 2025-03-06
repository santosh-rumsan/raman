import { ApiClient } from '@rumsan/raman/clients';
import { Category, Invoice } from '@rumsan/raman/types';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const useGetApproval = (id: string): UseQueryResult<Invoice, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['invoice', id],
      queryFn: async () => {
        const { data } = await RsClient.Public.getInvoicesByChallange(id);
        return data;
      },
    },
    queryClient,
  );
};

export const useInvoiceRejection = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: any }) => {
        const { data } = await RsClient.Public.rejectInvoice(
          payload.id,
          payload.data,
        );
        return data;
      },
      onSuccess: (updatedInvoice) => {
        queryClient?.setQueryData<Invoice[]>(
          ['invoice_list'],
          (oldData = []) => {
            return oldData.map((invoice) =>
              invoice.cuid === updatedInvoice.cuid ? updatedInvoice : invoice,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useInvoiceApproval = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: any }) => {
        const { data } = await RsClient.Public.approveInvoice(
          payload.id,
          payload.data,
        );
        return data;
      },
      onSuccess: (updatedInvoice) => {
        queryClient?.setQueryData<Invoice[]>(
          ['invoice_list'],
          (oldData = []) => {
            return oldData.map((invoice) =>
              invoice.cuid === updatedInvoice.cuid ? updatedInvoice : invoice,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const usePublicCategoryList = (): UseQueryResult<Category, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['category'],
      queryFn: async () => {
        const { data } = await RsClient.Public.getAllCategories();
        return data;
      },
    },
    queryClient,
  );
};
