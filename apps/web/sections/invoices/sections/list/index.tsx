'use client';

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { PATHS } from '@/routes/paths';
import { useInvoiceList } from '@rumsan/raman-ui/queries/invoice.query';
import { Invoice } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { useDataTableState } from '@rumsan/ui/components/data-table/datatable.state.hook';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useColumns } from './list.column';
import { DataTableToolbar } from './list.toolbar';

export function InvoiceList() {
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
  const columns = useColumns<Invoice>();

  const { data, isLoading } = useInvoiceList(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting[0]?.id,
      order: (sorting[0]?.desc ?? true) ? 'desc' : 'asc',
    },
    columnFiltersObject,
  );

  const table = useReactTable({
    data: (data?.data as Invoice[]) || [],
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
    },
    onColumnFiltersChange: setColumnFilters,
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
  const handleRowClick = (row: any) => {
    router.push(PATHS.INVOICE.DETAILS(row.original.cuid));
  };

  return (
    <main className="gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3"></div>
        <DataTableToolbar table={table} />
        <div className="rounded-md border min-h-96">
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
