import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { DataTableRowActions } from './list.actions';

export function useColumns<T>(): ColumnDef<T>[] {
  const { lookupByCuid } = useSelectLookUp();
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
            <ArrowUpDown size={16} className="ml-2" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'group',
      header: () => <div className="text-left">Group</div>,
      cell: ({ row }) => <div>{row.getValue('group')}</div>,
    },
    {
      accessorKey: 'owner',
      header: () => <div className="text-left">Owner</div>,

      cell: ({ row }) => {
        const ownerName = lookupByCuid('users', row.getValue('owner'));
        return <div>{ownerName?.name}</div>;
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
