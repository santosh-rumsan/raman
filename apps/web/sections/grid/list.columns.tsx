import { Button } from '@rumsan/shadcn-ui/components/button';
import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataTableRowActions } from './list.actions';

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-0 py-0 hover:bg-transparent"
          >
            Status
            <ArrowUpDown size={16} className="ml-2" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      accessorKey: 'email',
      header: () => <div className="text-left">Email</div>,
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'group',
      header: () => <div className="text-left">Group</div>,
      cell: ({ row }) => <div>{row.getValue('group')}</div>,
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-left">Amount</div>,

      cell: ({ row }) => {
        return <div>{row.getValue('amount')}</div>;
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
