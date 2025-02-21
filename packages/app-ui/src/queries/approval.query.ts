import { ApiClient } from '@rumsan/raman/clients';
import { Invoice } from '@rumsan/raman/types';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

export const useGetApproval = (id: string): UseQueryResult<Invoice, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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

export const usePublicCategoryList = (): UseQueryResult<any, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  const query = useQuery(
    {
      queryKey: ['category'],
      queryFn: async () => await RsClient.Public.getAllCategories(),
    },
    queryClient,
  );
  return query;
};
