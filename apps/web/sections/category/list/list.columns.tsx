import { IconByName } from '@/utils';
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
        const item = row?.original as { meta?: { icon?: string } };
        return (
          <div className="flex items-center space-x-2">
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
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'group',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Group" />
      ),
      cell: ({ row }) => {
        const item = row.getValue('group') as string;

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
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
}
