import { ApiClient } from '@rumsan/raman/clients';
import { LookupData } from '@rumsan/raman/types/misc.type';

import { useRumsan } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const useLookUpList = (): UseQueryResult<LookupData, Error> => {
  const { RsClient } = useRumsan<ApiClient>();

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
