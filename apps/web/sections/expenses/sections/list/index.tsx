'use client';

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';

import { PATHS } from '@/routes/paths';
import { useExpenseList } from '@rumsan/raman-ui/queries/expense.query';
import { Expense } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { useDataTableState } from '@rumsan/ui/components/data-table/datatable.state.hook';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function ExpenseList() {
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
    onColumnFiltersChange,
    onSortingChange,
  } = useDataTableState(searchParams, router);

  const columns = ListColumns<Expense>();
  const { data, isLoading } = useExpenseList(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting[0]?.id,
      order: (sorting[0]?.desc ?? true) ? 'desc' : 'asc',
    },
    columnFiltersObject,
  );

  const table = useReactTable({
    data: (data?.data as Expense[]) || [],
    columns,
    onSortingChange,
    onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
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

  const handleRowClick = (row: Row<Expense>) => {
    router.push(PATHS.EXPENSE.DETAILS(row.original.cuid));
  };

  return (
    <main className="gap-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-1"></div>
        <ListToolbar table={table} />
        <div className="rounded-md border">
          <DataTable
            table={table}
            columns={columns}
            handleRowClick={handleRowClick}
            isLoading={isLoading}
          />
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
