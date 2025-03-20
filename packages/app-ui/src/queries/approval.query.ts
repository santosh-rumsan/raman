import { ApiClient } from '@rumsan/raman/clients';
import { Category, Invoice, ReceiptApproval } from '@rumsan/raman/types';
import { useRumsan } from '@rumsan/ui/providers/query.provider';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const useGetApproval = (id: string): UseQueryResult<Invoice, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['invoice_approval', id],
      queryFn: async () => {
        const { data } = await RsClient.Public.getInvoicesByChallange(id);
        return data;
      },
    },
    queryClient,
  );
};

export const useInvoiceApproval = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: ReceiptApproval }) => {
        const { data } = await RsClient.Public.approveOrRejectReceipt(
          payload.id,
          payload.data,
        );
        return data;
      },
      onSuccess: (updatedInvoice) => {
        queryClient?.invalidateQueries({
          queryKey: ['invoice_approval'],
        });
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
