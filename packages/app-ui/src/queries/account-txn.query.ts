import { ApiClient } from '@rumsan/raman/clients';
import { AccountTxn } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const useAccountTxnList = (
  accountId: string,
  pagination: Pagination & { description?: string },
): UseQueryResult<{ data: AccountTxn[]; meta: any }> => {
  const { RsClient } = useRumsan<ApiClient>();
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
