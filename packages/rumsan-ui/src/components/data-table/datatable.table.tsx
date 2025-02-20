'use client';

import { ColumnDef, flexRender, Table } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';

import {
  TableBody,
  TableCell,
  Table as TableDom,
  TableHead,
  TableHeader,
  TableRow,
} from '@rumsan/shadcn-ui/components/table';
import { DataTableNoData } from './datatable.nodata.js';

interface DataTableProps<T, TData> {
  columns: ColumnDef<T>[];
  table: Table<TData>;
  isLoading?: boolean;
  handleRowClick?: (row: any) => void;
  entityName: string;
}

export function DataTable<T, TData>({
  table,
  columns,
  isLoading,
  handleRowClick,
  entityName,
}: DataTableProps<T, TData>) {
  return (
    <TableDom className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead className="text-sm text-black-900" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow className="h-96">
            <TableCell colSpan={columns.length} className="text-center">
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-5 w-5 text-black" />{' '}
              </div>
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className="text-sm text-black-900 cursor-pointer h-5"
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={() => handleRowClick && handleRowClick(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="h-96">
            <TableCell colSpan={columns.length} className="text-center">
              <DataTableNoData entityName={entityName} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </TableDom>
  );
}
