import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './list.actions';

export function useColumns<T>(): ColumnDef<T>[] {
    return [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const item = row.getValue('name') as string
                return (
                    <div>
                        <span>{item}</span>
                    </div>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },

        {
            accessorKey: 'currency',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Currency" />
            ),
            cell: ({ row }) => {
                const item = row.getValue('currency') as string;

                return (
                    <div>
                        <span>{item}</span>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: 'acctNumber',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Account Number" />
            ),
            cell: ({ row }) => {
                const item = row.getValue('acctNumber') as string;

                return (
                    <div>
                        <span>{item}</span>
                    </div>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },

            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: 'balance',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Balance" />
            ),
            cell: ({ row }) => {
                const item = row.getValue('balance') as string;

                return (
                    <div>
                        <span>{item}</span>
                    </div>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },

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
