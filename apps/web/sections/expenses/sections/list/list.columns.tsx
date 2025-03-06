'use client';

import { ColumnDef } from '@tanstack/react-table';

import { IconByName } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Expense } from '@rumsan/raman/types';
import { cn } from '@rumsan/shadcn-ui/lib/utils';
import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { format } from 'date-fns';
import { Check } from 'lucide-react';

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

    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const item = lookupByCuid('categories', row.getValue('categoryId'));
        const { isVerified, isReconciled } = row.original as Expense;
        const iconColor =
          isVerified && isReconciled
            ? 'text-green-600'
            : isVerified || isReconciled
              ? 'text-yellow-600'
              : 'text-red-600';

        return (
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gray-100 h-6 w-6 flex items-center justify-center">
              <IconByName
                name={item?.meta?.icon}
                defaultIcon="HandCoins"
                className={cn(iconColor, 'h-4 w-4')}
                strokeWidth={2.5}
              />
            </div>
            <span>
              {row.getValue('date')
                ? format(row.getValue('date'), 'yyyy-MM-dd')
                : null}
            </span>
          </div>
        );
      },
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
          <div>
            <span>{categoryName?.name}</span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'departmentId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
      ),
      cell: ({ row }) => {
        const item = lookupByCuid('departments', row.getValue('departmentId'));

        return (
          <div>
            <span>{item?.name}</span>
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
          <div>
            <span>{row.getValue('amount')}</span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'isVerified',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Verified" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex pl-4">
            {row.getValue('isVerified') ? <Check /> : ''}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'isReconciled',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reconciled" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex pl-6">
            {row.getValue('isReconciled') ? <Check /> : ''}
          </div>
        );
      },
      enableSorting: false,
    },

    {
      accessorKey: 'description',
      header: ({ column }: { column: any }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }: { row: any }) => {
        const source = row.original.source;

        return (
          <div>
            <span className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
              {row.getValue('description')}
            </span>
          </div>
        );
      },
      enableSorting: false,
    },
  ];
}
