'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import { useCategoryList } from '@rumsan/raman-ui/queries/category.query';
import { Category } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { useDataTableState } from '@rumsan/ui/components/data-table/datatable.state.hook';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function CategoryList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    sorting,
    setSorting,
    columnFilters,
    columnFiltersObject,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    updateQueryParams,
  } = useDataTableState(searchParams, router);
  const columns = useColumns<Category>();

  const categoryList = useCategoryList({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting[0]?.id,
    order: (sorting[0]?.desc ?? true) ? 'desc' : 'asc',
  },
    columnFiltersObject,
  );
  console.log(columnFiltersObject, 'columnFiltersObject');
  console.log(categoryList, 'categoryList');
  console.log(categoryList?.data, 'categoryList?.data');
  console.log(categoryList?.data?.data, 'categoryList?.data?.data');

  const table = useReactTable({
    data: (categoryList?.data?.data as Category[]) || [],
    columns,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      updateQueryParams({
        sort: newSorting[0]?.id || '',
        order: newSorting[0]?.desc ? 'desc' : 'asc',
      });
    }, onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    rowCount: categoryList?.data?.meta?.total,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <main className="gap-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3"></div>
        <ListToolbar table={table} />
        <div className="rounded-md border">
          <DataTable
            table={table}
            columns={columns}
            isLoading={categoryList.isLoading}
          />
        </div>
        <DataTablePagination
          table={table}
          setPagination={(updater: any) => {
            const newPagination =
              typeof updater === 'function' ? updater(pagination) : updater;
            setPagination(newPagination);
            updateQueryParams({
              page: newPagination.pageIndex + 1,
              limit: newPagination.pageSize,
            });
          }}
          pagination={pagination}
        />
      </div>
    </main>
  );
}
