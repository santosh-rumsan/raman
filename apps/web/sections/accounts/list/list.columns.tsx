import { Button } from '@rumsan/shadcn-ui/components/button';
import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataTableRowActions } from './list.actions';

export function useColumns<T>(): ColumnDef<T>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="px-0 py-0 hover:bg-transparent"
                    >
                        Name
                        <ArrowUpDown className="ml-2" />
                    </Button>
                );
            },


        },

        {
            accessorKey: 'currency',
            header: () => <div className="text-left">Currency</div>,
            cell: ({ row }) => <div>{row.getValue('currency')}</div>,
        },

        {
            accessorKey: 'acctNumber',
            header: () => <div className="text-left">Account Number</div>,
            cell: ({ row }) => <div>{row.getValue('acctNumber')}</div>
        },
        {
            accessorKey: 'balance',
            header: () => <div className="text-left">Balance</div>,
            cell: ({ row }) => <div>{row.getValue('balance')}</div>
        },
        {
            id: 'actions',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Action" />
            ),
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ];
}
