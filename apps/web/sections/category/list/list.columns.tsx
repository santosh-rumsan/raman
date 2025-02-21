import { IconByName } from '@/utils';
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

      cell: ({ row }) => {
        const item = row?.original as { meta?: { icon?: string } };

        return (
          <div className="flex items-center space-x-2 gap-">
            <div className="rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center">
              <IconByName
                name={item?.meta?.icon ?? 'HandCoins'}
                defaultIcon="HandCoins"
                className="h-5 w-5"
                strokeWidth={2.5}
              />
            </div>
            <span className="truncate font-medium">{row.getValue('name')}</span>
          </div>
        );
      },
    },

    {
      accessorKey: 'group',
      header: () => <div className="text-left">Group</div>,
      cell: ({ row }) => <div>{row.getValue('group')}</div>,
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
