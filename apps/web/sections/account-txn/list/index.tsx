'use client';

import {
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { useAccountTxnList } from '@rumsan/raman-ui/queries/account-txn.query';
import { AccountTxn } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useRouter } from 'next/navigation';
import { useColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function AccountTxnList(props: { accountId: string }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const accountList = useAccountTxnList(props.accountId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting[0]?.id,
    order: sorting[0]?.desc ? 'desc' : 'asc',
    description: columnFilters[0]?.value,
  });
  const columns = useColumns<AccountTxn>();

  const table = useReactTable({
    data: (accountList.data?.data as AccountTxn[]) || [],
    columns,
    onSortingChange: setSorting,
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
      pagination: pagination,
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
            entityName="Account"
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
