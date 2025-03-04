'use client';

import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { useDebounce } from '@rumsan/ui/hooks/debounce.hook';
import { Table } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategoryAdd } from '../form/category.add';
//import { DepartmentAdd } from '../form/department.add copy';

interface ListToolbarProps<TData> {
  table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
  const { categories } = useSelectLookUp();
  console.log(categories, 'categories');

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
          className="h-8 w-[150px] lg:w-[400px] bg-white"
          placeholder="Search Category"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}

        />

        {table.getColumn('group') && (
          <ListFilter
            column={table.getColumn('group')}
            title="Group"
            options={categories}
          />
        )}
      </div>
      <DataTableViewOptions table={table} />

      <CategoryAdd>
        <Button className="m-auto text-sm h-8 ml-2 px-3">
          <PlusCircle className="h-5 w-5" />
          Add
        </Button>
      </CategoryAdd>
    </div>
  );
}
