'use client';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { PATHS } from '@/routes/paths';
import { useExpenseList } from '@rumsan/raman-ui/queries/expense.query';
import { Expense } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ListColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function ExpenseList() {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useExpenseList(pagination);
  const columns = ListColumns<Expense>();

  const table = useReactTable({
    data: (data?.data as Expense[]) || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    pageCount: data?.response.meta?.lastPage || 1,
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
  });

  const handleRowClick = (row: any) => {
    router.push(PATHS.EXPENSE.DETAILS(row.original.cuid));
  };

  return (
    <main className="gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <p className="text-gray-500 font-normal text-sm">
            Important: Expenses incurred by the office should be entered within
            24 hours.
          </p>
        </div>
        <ListToolbar table={table} />
        <div className="rounded-md border bg-white p-1 min-h-96">
          <DataTable
            table={table}
            columns={columns}
            handleRowClick={handleRowClick}
            isLoading={isLoading}
            entityName="Expense"
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
