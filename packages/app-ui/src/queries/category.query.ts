import { ApiClient } from '@rumsan/raman/clients';
import { Category, CreateCategory, EditCategory } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCategoryList = (pagination: Pagination, filters: any,) => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['category_list', { ...pagination, ...filters }],

      queryFn: async () => {
        const { response } = await RsClient.Category.search(pagination, filters);
        return {
          data: response.data,
          meta: response.meta
        };
      },
    },
    queryClient,
  );
};

export const useAddCategory = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
  const { queryClient, RsClient } = useRumsan<ApiClient>();

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
