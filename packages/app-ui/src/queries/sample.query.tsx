import { ApiClient } from '@rumsan/raman/clients';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTableData = async ({ queryKey }) => {
  const [_key, { page, limit, sort, order, filter }] = queryKey;
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users',
    {
      params: {
        _page: page,
        _limit: limit,
        _sort: sort,
        _order: order,
        q: filter,
      },
    },
  );
  return response.data;
};

export const useSampleData = (pagination: Pagination) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();
  console.log(pagination);
  return useQuery(
    {
      queryKey: [
        'tableData',
        {
          page: pagination.page,
          limit: pagination.limit,
        },
      ],
      queryFn: fetchTableData,
      placeholderData: (previousData) => previousData,
    },
    queryClient,
  );
};

// export function useSampleData({ page, limit, sortBy, sortOrder }) {
//   const { queryClient, RsClient } = useRumsan<ApiClient>();
//   return useQuery(
//     {
//       queryKey: ['sampleData', page, limit, sortBy, sortOrder], // Re-fetch on change
//       queryFn: async () => {
//         const response = await fetch(
//           `https://jsonplaceholder.typicode.com/users?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
//         );
//         return response.json();
//       },
//       placeholderData: (previousData) => previousData,
//     },
//     queryClient,
//   );
// }
