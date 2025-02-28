'use client';

import { Input } from '@rumsan/shadcn-ui/components/input';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { useDebounce } from '@rumsan/ui/hooks/debounce.hook';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface ListToolbarProps<TData> {
  table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const column = table.getColumn('description');
    if (column) {
      column.setFilterValue(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[400px] bg-white"
          placeholder="Search Account"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          type="text"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
