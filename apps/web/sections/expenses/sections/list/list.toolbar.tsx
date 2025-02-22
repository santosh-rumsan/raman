'use client';

import { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';

import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';

import { PATHS } from '@/routes/paths';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { useRouter } from 'next/navigation';

interface ListToolbarProps<TData> {
  table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
  const router = useRouter();
  const isFiltered = table.getState().columnFilters.length > 0;

  const { categories, departments } = useSelectLookUp();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search expenses..."
          value={
            (table.getColumn('description')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('description')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] bg-white"
        />

        {table.getColumn('categoryId') && (
          <ListFilter
            column={table.getColumn('categoryId')}
            title="Category"
            options={categories}
          />
        )}

        {table.getColumn('departmentId') && (
          <ListFilter
            column={table.getColumn('departmentId')}
            title="Department"
            options={departments}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <Button
        className="m-auto text-sm h-8 ml-2 px-3"
        onClick={() => router.push(PATHS.EXPENSE.ADD)}
      >
        <PlusCircle className="h-5 w-5" />
        Add
      </Button>
    </div>
  );
}
