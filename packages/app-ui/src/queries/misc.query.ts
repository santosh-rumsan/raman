import { ApiClient } from '@rumsan/raman/clients';

import { useRumsan } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';

export const useLookUpList = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['lookup_list'],
      queryFn: async () => {
        const { data } = await RsClient.Misc.getLookupData();
        return data;
      },
    },
    queryClient,
  );
};
