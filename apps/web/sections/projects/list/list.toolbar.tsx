'use client';

import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { Table } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import { ProjectAdd } from '../form/project.add';

interface ListToolbarProps<TData> {
  table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
  const { users, departments } = useSelectLookUp();
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search projects..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
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
