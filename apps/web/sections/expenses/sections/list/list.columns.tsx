'use client';

import { Expense } from '@rumsan/raman';
import { ColumnDef } from '@tanstack/react-table';

import { IconByName } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { format } from 'date-fns';
import { DataTableRowActions } from './list.actions';

export const statusColor = {
  true: 'bg-red-50 text-red-600',
  false: 'bg-green-50 text-green-800',
};
export function ListColumns<T>(): ColumnDef<T>[] {
  const { lookupByCuid } = useSelectLookUp();
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },

    // {
    //   id: 'select',

    //   cell: ({ row }) => (
    //     <div className="h-7 w-7 bg-blue-50 flex items-center justify-center rounded-full">
    //       <User className="h-4 w-4" strokeWidth={2} />
    //     </div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} className="ml-10" title="Date" />
      ),
      cell: ({ row }) => {
        const expense = row.original as Expense;
        const item = lookupByCuid('categories', row.getValue('categoryId'));
        return (
          <div className="flex items-center space-x-2 gap-">
            <div className="rounded-full bg-gray-100 h-8 w-8 flex items-center justify-center">
              <IconByName
                name={item?.meta?.icon}
                defaultIcon="HandCoins"
                className="h-5 w-5"
                strokeWidth={2.5}
                color={expense?.isApproved ? "#4CAF50" : "#FFC107"}
              />
            </div>
            <span className="truncate font-medium">
              {row.getValue('date')
                ? format(row.getValue('date'), 'yyyy-MM-dd')
                : null}
            </span>
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
      accessorKey: 'description',
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }: { row: any }) => {
        const source = row.original.source;

        return (
          <div className="flex space-x-2">
            <span className="truncate font-medium">
              {row.getValue('description')}
            </span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="truncate font-medium">
              {row.getValue('amount')}
            </span>
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
      accessorKey: 'categoryId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const categoryName = lookupByCuid(
          'categories',
          row.getValue('categoryId'),
        );

        return (
          <div className="flex space-x-2">
            <span className="truncate font-medium">{categoryName?.name}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: 'departmentId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const item = lookupByCuid('departments', row.getValue('departmentId'));

        return (
          <div className="flex space-x-2">
            <span className="truncate font-medium">{item?.name}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: 'isPending',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        return (
          <div
            className={`flex space-x-2 h-7 w-[100px] items-center justify-center rounded-2xl p-2 ${statusColor[row.getValue('isPending') as keyof typeof statusColor]
              }`}
          >
            <span className="truncate text-xs">
              {row.getValue('isPending') ? 'Pending' : 'Reconciled'}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
