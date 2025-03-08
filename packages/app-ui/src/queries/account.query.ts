import { ApiClient } from '@rumsan/raman/clients';
import { Account, CreateAccount, EditAccount } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/ui/providers/query.provider';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const useAccountList = (
  pagination: Pagination,
  filters: any,
): UseQueryResult<
  {
    data: Account[];
    meta: any;
  },
  Error
> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['account_list', { ...pagination, ...filters }],
      queryFn: async () => {
        const { response } = await RsClient.Account.search(pagination, filters);
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    },
    queryClient,
  );
};

export const useAddAccount = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: CreateAccount) => {
        const { data } = await RsClient.Account.create(payload);

        return data;
      },
      onSuccess: (newAccount) => {
        queryClient?.setQueryData<Account[]>(
          ['account_list'],
          (oldData = []) => {
            return [newAccount, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useEditAccount = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: EditAccount }) => {
        const { data } = await RsClient.Account.update(
          payload.id,
          payload.data,
        );

        return data;
      },
      onSuccess: (updatedAccount: any) => {
        queryClient?.setQueryData<Account[]>(
          ['account_list'],
          (oldData = []) => {
            return oldData.map((account) =>
              account.cuid === updatedAccount.cuid ? updatedAccount : account,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useAccountGet = (cuid: string): UseQueryResult<Account, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['account_get'],
      queryFn: async () => {
        const { data } = await RsClient.Account.findOne(cuid);
        return data;
      },
    },
    queryClient,
  );
};

export const useAccountByUuid = (
  uuid: string,
): UseQueryResult<Account, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['account', uuid],
      queryFn: async () => {
        const { data } = await RsClient.Account.findOne(uuid);
        return data;
      },

      enabled: !!uuid, // Only fetch if uuid is provided
    },
    queryClient,
  );
};
