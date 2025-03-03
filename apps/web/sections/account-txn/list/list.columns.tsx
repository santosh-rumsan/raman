import { DataTableColumnHeader } from '@rumsan/ui/components/data-table/datatable.column.header';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export function useColumns<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: 'txnDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <div>
          {row.getValue('txnDate')
            ? format(row.getValue('txnDate'), 'yyyy-MM-dd')
            : null}
        </div>
      ),
    },
    {
      accessorKey: 'txnId',
      enableSorting: false,
      header: () => <div className="text-left">TxnID</div>,
      cell: ({ row }) => <div>{row.getValue('txnId')}</div>,
    },

    {
      accessorKey: 'description',
      enableSorting: false,
      header: () => <div className="text-left">Currency</div>,
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      accessorKey: 'creditAmount',
      enableSorting: false,
      header: () => <div className="text-right">Credit</div>,
      cell: ({ row }) => {
        const amt = parseInt(row.getValue('creditAmount'));
        if (amt < 1) return '';
        return (
          <div className="text-right">
            {amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
        );
      },
    },
    {
      accessorKey: 'debitAmount',
      enableSorting: false,
      header: () => <div className="text-right">Debit</div>,
      cell: ({ row }) => {
        const amt = parseInt(row.getValue('debitAmount'));
        if (amt < 1) return '';
        return (
          <div className="text-right">
            {' '}
            {amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
  ];
}
