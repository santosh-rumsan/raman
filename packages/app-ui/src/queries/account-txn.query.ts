import { ApiClient } from '@rumsan/raman/clients';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';

export const useAccountTxnList = (
  accountId: string,
  pagination: Pagination & { description?: string },
) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();
  return useQuery(
    {
      queryKey: ['account_txn_list', pagination],
      queryFn: async () => {
        const { response } = await RsClient.Account.listTransactions(
          accountId,
          pagination,
        );
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      placeholderData: (previousData) => previousData,
    },
    queryClient,
  );
};
