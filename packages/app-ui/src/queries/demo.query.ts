import { ApiClient } from '@rumsan/raman/clients';

import { useRumsan } from '@rumsan/ui/providers/query.provider';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const usePing = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['ping'],
      queryFn: async () => {
        const { data } = await RsClient.Demo.hello();
        return data;
      },
      enabled: false,
    },
    queryClient,
  );
};
