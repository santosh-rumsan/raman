'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useAccountTxnList } from '@rumsan/raman-ui/queries/account-txn.query';
import { AccountTxn } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { useDataTableState } from '@rumsan/ui/components/data-table/datatable.state.hook';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter, useSearchParams } from 'next/navigation';
import { useColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function AccountTxnList(props: { accountId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    updateQueryParams,
  } = useDataTableState(searchParams, router);
  const columns = useColumns<AccountTxn>();

  // Fetch data with updated query params
  const accountList = useAccountTxnList(props.accountId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting[0]?.id,
    order: (sorting[0]?.desc ?? true) ? 'desc' : 'asc',
    description: columnFilters[0]?.value,
  });

  const table = useReactTable({
    data: (accountList.data?.data as AccountTxn[]) || [],
    columns,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
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
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    rowCount: accountList.data?.meta?.total,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
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
            isLoading={accountList.isLoading}
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
