'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useDepartmentList } from '@rumsan/raman-ui/queries/department.query';
import { Department } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { useDataTableState } from '@rumsan/ui/components/data-table/datatable.state.hook';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function DepartmentList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    sorting,
    columnFilters,
    columnFiltersObject,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    onSortingChange,
    onColumnFiltersChange,
  } = useDataTableState(searchParams, router);

  const columns = useColumns<Department>();

  const { data, isLoading } = useDepartmentList(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting[0]?.id,
      order: (sorting[0]?.desc ?? true) ? 'desc' : 'asc',
    },
    columnFiltersObject,
  );

  const table = useReactTable({
    data: (data?.data as Department[]) || [],
    columns,
    onSortingChange,
    onColumnFiltersChange,
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
    rowCount: data?.meta?.total,
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
        <div className="flex flex-col gap-1 my-3">
          <p className="text-gray-500 font-normal text-sm">
            Note: Please consult with the management before adding a new
            department.
          </p>
        </div>
        <ListToolbar table={table} />
        <div className="rounded-md border">
          <DataTable table={table} columns={columns} isLoading={isLoading} />
        </div>
        <DataTablePagination
          table={table}
          setPagination={setPagination}
          pagination={pagination}
        />
      </div>
    </main>
  );
}
