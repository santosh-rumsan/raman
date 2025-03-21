import { IconByName } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export type ReceiptStatusColors = {
  PENDING: string;
  REJECTED: string;
  REIMBURSED: string;
  APPROVED: string;
};

export const invoiceStatusColors: ReceiptStatusColors = {
  PENDING: 'text-yellow-600',
  REJECTED: 'text-red-600',
  REIMBURSED: 'text-green-500',
  APPROVED: 'text-purple-600',
};

function extractInitials(fullName: string): string {
  if (!fullName) return 'RS';

  // Split the name into parts
  const nameParts = fullName.trim().split(/\s+/);

  // Extract initials from the first and last parts
  const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';
  const lastInitial = nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || '';

  return firstInitial + lastInitial;
}

export function useColumns<T>(): ColumnDef<T>[] {
  const { lookupByCuid } = useSelectLookUp();

  return [
    {
      accessorKey: 'userId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const userName = lookupByCuid('users', row.getValue('userId'));
        const item = lookupByCuid('categories', row.getValue('categoryId'));
        return (
          <div className="flex items-center space-x-2 gap-1">
            <div className="h-6 w-6  flex items-center justify-center rounded-full">
              {/* <Avatar className="h-8 w-8 ">
                <AvatarImage alt={userName?.name} />
                <AvatarFallback
                  style={{ fontWeight: 500 }}
                  className="bg-blue-50"
                >
                  {extractInitials(userName?.name || '')}
                </AvatarFallback>
              </Avatar> */}
              <IconByName
                name={item?.meta?.icon}
                defaultIcon="ReceiptIndianRupee"
                className="h-4 w-4"
                strokeWidth={2.5}
              />
            </div>
            <span>{userName?.name || ''}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span>{row.getValue('amount')}</span>
          </div>
        );
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
            <span>{categoryName?.name || 'Unknown Category'}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'projectId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Project" />
      ),
      cell: ({ row }) => {
        const projectName = lookupByCuid('projects', row.getValue('projectId'));

        return (
          <div className="flex space-x-2">
            <span>{projectName?.name || 'Unknown Project'}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'invoiceType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice Type" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 h-7 w-[80px] items-center justify-center p-2">
            <span className="text-xs">{row.getValue('invoiceType')}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        return (
          <div
            className={`flex space-x-2 h-7 w-[100px] items-center justify-center p-2 font-medium ${
              invoiceStatusColors[
                row.getValue('status') as keyof ReceiptStatusColors
              ]
            }`}
          >
            <span className="truncate text-xs">{row.getValue('status')}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span>
              {row.getValue('date')
                ? format(row.getValue('date'), 'dd MMM yyyy')
                : ''}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },

    // {
    //   id: 'actions',
    //   cell: ({ row }) => <DataTableRowActions row={row} router={router} />,
    // },

    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const invoices = row.original;

        return <div className="items-center text-center"></div>;
      },
    },
  ];
}
