import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';

function convertArrayToObject(
  arr: { id: string; value: any }[],
): Record<string, any> {
  return arr.reduce(
    (acc, { id, value }) => {
      acc[id] = Array.isArray(value) && value.length === 1 ? value[0] : value;
      return acc;
    },
    {} as Record<string, any>,
  );
}

export function useDataTableState(
  searchParams: URLSearchParams,
  router: { replace: (url: string) => void },
  defaultPage = 1,
  defaultLimit = 15,
) {
  // Parse query params for initial state
  const initialPage = Number(searchParams.get('page')) || defaultPage;
  const initialLimit = Number(searchParams.get('limit')) || defaultLimit;
  const initialSort = searchParams.get('sort') || '';
  const initialOrder = searchParams.get('order') === 'desc';

  const [sorting, setSorting] = useState<SortingState>(
    initialSort ? [{ id: initialSort, desc: initialOrder }] : [],
  );
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: any }[]
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPaginationState] = useState({
    pageIndex: Math.max(initialPage - 1, 0),
    pageSize: initialLimit,
  });

  // Function to update query parameters
  const updateQueryParams = (
    params: Partial<Record<string, string | number>>,
  ) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    router.replace(`?${newParams.toString()}`);
  };

  const onSortingChange = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    updateQueryParams({
      page: 1,
      sort: newSorting[0]?.id || '',
      order: newSorting[0]?.desc ? 'desc' : 'asc',
    });
  };

  const onColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    const newFilters =
      typeof updater === 'function' ? updater(columnFilters) : updater;
    setColumnFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    updateQueryParams({ page: 1 });
  };

  const setPagination = (updater: Updater<PaginationState>) => {
    const newPagination =
      typeof updater === 'function' ? updater(pagination) : updater;
    setPaginationState(newPagination);
    updateQueryParams({
      page: newPagination.pageIndex + 1,
      limit: newPagination.pageSize,
    });
  };

  return {
    sorting,
    setSorting,
    columnFiltersObject: convertArrayToObject(columnFilters),
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    setPaginationState,
    onSortingChange,
    onColumnFiltersChange,
    updateQueryParams,
  };
}
