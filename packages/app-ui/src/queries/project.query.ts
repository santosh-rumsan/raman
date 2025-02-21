import { ApiClient } from '@rumsan/raman/clients';
import { CreateProject, EditProject, Project } from '@rumsan/raman/types';
import { Pagination } from '@rumsan/raman/types/pagination.type';
import { useRumsan } from '@rumsan/react-query';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';

export const useProjectList = (
  pager: Pagination = { page: 1, limit: 20 },
): UseQueryResult<Project[], Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['project_list'],
      queryFn: async () => {
        const { data } = await RsClient.Project.list({
          page: pager.page,
          limit: pager.limit,
        });
        return data;
      },
    },
    queryClient,
  );
};

export const useAddProject = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: CreateProject) => {
        const { data } = await RsClient.Project.create(payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(data, 'data in query');

        return data;
      },
      onSuccess: (newProject) => {
        queryClient?.setQueryData<Project[]>(
          ['project_list'],
          (oldData = []) => {
            return [newProject, ...oldData];
          },
        );
      },
    },
    queryClient,
  );
};

export const useEditProject = () => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useMutation(
    {
      mutationFn: async (payload: { id: string; data: EditProject }) => {
        const { data } = await RsClient.Project.update(
          payload.id,
          payload.data,
        );

        return data;
      },
      onSuccess: (updatedProject) => {
        queryClient?.setQueryData<Project[]>(
          ['project_list'],
          (oldData = []) => {
            return oldData.map((project) =>
              project.cuid === updatedProject.cuid ? updatedProject : project,
            );
          },
        );
      },
    },
    queryClient,
  );
};

export const useProjectGet = (id: string): UseQueryResult<Project, Error> => {
  const { queryClient, RsClient } = useRumsan<ApiClient>();

  return useQuery(
    {
      queryKey: ['project_get', id],
      queryFn: async () => {
        const { data } = await RsClient.Project.get(id);
        return data;
      },
    },
    queryClient,
  );
};
