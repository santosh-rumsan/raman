'use client';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { useCategoryList } from '@rumsan/raman-ui/queries/category.query';
import { Category } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function CategoryList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const categoryList = useCategoryList();
  const columns = useColumns<Category>();

  const table = useReactTable({
    data: (categoryList.data as Category[]) || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <main className="gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3"></div>
        <ListToolbar table={table} />
        <div className="rounded-md border">
          <DataTable
            table={table}
            columns={columns}
            isLoading={categoryList.isLoading}
            entityName="Category"
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
