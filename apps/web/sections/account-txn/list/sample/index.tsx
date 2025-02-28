import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useSampleData } from '../../../../../../packages/app-ui/src/queries/sample.query';

export function SampleDataTable() {
  const [sorting, setSorting] = useState([]); // Stores sorting state
  const [filtering, setFiltering] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  // Extract sorting values (column ID & direction)
  const sort = sorting.length > 0 ? sorting[0].id : 'id';
  const order = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'asc';

  // Fetch data with sorting parameters
  const { data, isLoading } = useSampleData({ page, limit, sort, order });

  const columns = [
    { accessorKey: 'id', header: 'ID', enableSorting: false },
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'email', header: 'Email', enableSorting: true },
    { accessorKey: 'phone', header: 'Phone', enableSorting: false },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: true, // **Indicates sorting is handled by the server**
  });

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border p-2 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {header.column.getIsSorted() === 'asc' ? (
                    <span className="text-gray-400"> ▲</span>
                  ) : header.column.getIsSorted() === 'desc' ? (
                    <span className="text-gray-400"> ▼</span>
                  ) : (
                    ''
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                Loading...
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 border bg-gray-200"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="p-2 border bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
