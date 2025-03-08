import { ApiClient } from '@rumsan/raman/clients';
import { Category, CreateCategory, EditCategory } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/ui/providers/query.provider';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { queryClient } from './query.client';

export const useCategoryList = (
  pagination: Pagination,
  filters: any,
): UseQueryResult<
  {
    data: Category[];
    meta: any;
  },
  Error
> => {
  const { RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['category_list', { ...pagination, ...filters }],

      queryFn: async () => {
        const { response } = await RsClient.Category.search(
          pagination,
          filters,
        );
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    },
    queryClient,
  );
};

export const useAddCategory = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: CreateCategory) => {
        const { data } = await RsClient.Category.create(payload);
        return data;
      },
      onSuccess: (newCategory) => {
        queryClient?.setQueryData<Category[]>(
          ['category_list'],
          (oldData = []) => {
            return [newCategory, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useEditCategory = () => {
  const { RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: EditCategory }) => {
        const { data } = await RsClient.Category.update(
          payload.id,
          payload.data,
        );

        return data;
      },
      onSuccess: (updatedCategory) => {
        queryClient?.setQueryData<Category[]>(
          ['category_list'],
          (oldData = []) => {
            return oldData.map((category) =>
              category.cuid === updatedCategory.cuid
                ? updatedCategory
                : category,
            );
          },
        );
      },
    },
    queryClient,
  );
};
