import { ApiClient } from '@rumsan/raman/clients';
import { Account, CreateAccount, EditAccount } from '@rumsan/raman/types';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAccountList = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['account_list'],
      queryFn: async () => {
        const { data } = await RsClient.Account.list({ page: 1, limit: 20 });

        return data;
      },
    },
    queryClient,
  );
};

export const useAddAccount = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation({
    mutationFn: async (payload: CreateAccount) => {
      const { data } = await RsClient.Account.create(payload);

      return data;
    },
    onSuccess: (newAccount) => {
      queryClient?.setQueryData<Account[]>(['account_list'], (oldData = []) => {
        return [...oldData, newAccount];
      });
    },
  });
};

export const useEditAccount = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation({
    mutationFn: async (payload: { id: string; data: EditAccount }) => {
      const { data } = await RsClient.Account.update(payload.id, payload.data);

      return data;
    },
    onSuccess: (updatedAccount: any) => {
      queryClient?.setQueryData<Account[]>(['account_list'], (oldData = []) => {
        return oldData.map((account) =>
          account.cuid === updatedAccount.cuid ? updatedAccount : account,
        );
      });
    },
  });
};

export const useAccountGet = (cuid: string) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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

export const useAccountByUuid = (uuid: string) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
