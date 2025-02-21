'use client';

import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { Table } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import { DepartmentAdd } from '../form/department.add';
import groups from '../group.json';

interface ListToolbarProps<TData> {
  table: Table<TData>;
}
//TODO: fix any
export function ListToolbar<T>({ table }: ListToolbarProps<T>): any {
  const { users } = useSelectLookUp();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[400px] bg-white"
          placeholder="Search Department"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          type="text"
        />

        {table.getColumn('group') && (
          <ListFilter
            column={table.getColumn('group')}
            title="Group"
            options={groups}
          />
        )}
        {table.getColumn('owner') && (
          <ListFilter
            column={table.getColumn('owner')}
            title="Owner"
            options={users ?? []}
          />
        )}
      </div>
      <DataTableViewOptions table={table} />
      <DepartmentAdd>
        <Button className="m-auto text-sm h-8 ml-2 px-3">
          <PlusCircle className="h-5 w-5" />
          Add
        </Button>
      </DepartmentAdd>
    </div>
  );
}
