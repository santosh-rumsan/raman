'use client';

import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { useDebounce } from '@rumsan/ui/hooks/debounce.hook';
import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProjectAdd } from '../form/project.add';

interface ListToolbarProps<TData> {
  table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { users, departments } = useSelectLookUp();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const column = table.getColumn('name');
    if (column) {
      column.setFilterValue(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] bg-white"
        />

        {table.getColumn('departmentId') && (
          <ListFilter
            column={table.getColumn('departmentId')}
            title="Department"
            options={departments ?? []}
          />
        )}
        {table.getColumn('owner') && (
          <ListFilter
            column={table.getColumn('owner')}
            title="Owner"
            options={users ?? []}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setSearchTerm('')}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />

      <ProjectAdd>
        <Button className="m-auto text-sm h-8 ml-2 px-3">
          <PlusCircle className="h-5 w-5" />
          Add
        </Button>
      </ProjectAdd>
    </div>
  );
}
