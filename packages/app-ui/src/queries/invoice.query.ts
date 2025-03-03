import { ApiClient } from '@rumsan/raman/clients';
import { Invoice, InvoiceExtended } from '@rumsan/raman/types';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

export const useInvoiceList = (pagination: any): UseQueryResult<any, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  const query = useQuery(
    {
      queryKey: ['invoice_list', pagination],
      queryFn: () =>
        RsClient.Invoice.list({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        }),
    },
    queryClient,
  );

  return query;
};

export const useGetInvoice = (
  id: string,
): UseQueryResult<InvoiceExtended, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();
  return useQuery(
    {
      queryKey: ['invoice_get', id],
      queryFn: async () => {
        const { data } = await RsClient.Invoice.get(id);
        return data;
      },
    },
    queryClient,
  );
};

// export const useAddInvoice = () => {
//   const { queryClient, RsClient } = useRumsan<ApiClient>();

//   return useMutation({
//     mutationFn: async (payload: any) => {
//       const { data } = await RsClient.Invoice.create(payload);

//       return data;
//     },
//     onSuccess: (newExpense) => {
//       queryClient?.setQueryData<Invoice[]>(['invoice_list'], (oldData = []) => {
//         return [...oldData, newExpense];
//       });
//     },
//   });
// };

export const useAddInvoice = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: any) => {
        const { data } = await RsClient.Invoice.create(payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return data;
      },
      onSuccess: (newExpense) => {
        queryClient?.setQueryData<Invoice[]>(
          ['invoice_list'],
          (oldData = []) => {
            return [newExpense, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useInvoiceReimburse = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: any }) => {
        const { data } = await RsClient.Invoice.reimburseInvoice(
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
