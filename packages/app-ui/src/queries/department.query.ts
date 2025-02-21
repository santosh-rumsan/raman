import { ApiClient } from '@rumsan/raman/clients';
import {
  CreateDepartment,
  Department,
  EditDepartment,
} from '@rumsan/raman/types';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

export const useDepartmentList = (): UseQueryResult<Department[], Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['department_list'],
      queryFn: async () => {
        const { data } = await RsClient.Department.list({
          page: 1,
          limit: 1000,
        });
        return data;
      },
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );
};

export const useAddDepartment = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: CreateDepartment) => {
        const { data } = await RsClient.Department.create(payload);

        return data;
      },
      onSuccess: (newDepartment) => {
        queryClient?.setQueryData<Department[]>(
          ['department_list'],
          (oldData = []) => {
            return [newDepartment, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useEditDepartment = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: EditDepartment }) => {
        const { data } = await RsClient.Department.update(
          payload.id,
          payload.data,
        );

        return data;
      },
      onSuccess: (updatedDepartment) => {
        queryClient?.setQueryData<Department[]>(
          ['department_list'],
          (oldData = []) => {
            return oldData.map((department) =>
              department.cuid === updatedDepartment.cuid
                ? updatedDepartment
                : department,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useDepartmentGet = (
  id: string,
): UseQueryResult<Department, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['department_get'],
      queryFn: async () => {
        const { data } = await RsClient.Department.get(id);
        console.log(data, 'data');
        return data;
      },
    },
    queryClient,
  );
};
