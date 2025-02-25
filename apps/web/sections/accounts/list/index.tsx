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

import { useAccountList } from '@rumsan/raman-ui/queries/account.query';
import { Account } from '@rumsan/raman/types';
import { DataTablePagination } from '@rumsan/ui/components/data-table/datatable.pagination';
import { DataTable } from '@rumsan/ui/components/data-table/datatable.table';
import { useColumns } from './list.columns';
import { ListToolbar } from './list.toolbar';

export function AccountList() {
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

    const accountList = useAccountList();
    console.log(accountList.data, 'accountList');
    const columns = useColumns<Account>();

    const table = useReactTable({
        data: (accountList.data as Account[]) || [],
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
