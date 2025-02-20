'use client';

import { Input } from '@rumsan/shadcn-ui/components/input';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { Table } from '@tanstack/react-table';

const groups = [
  {
    label: 'Rumsan',
    value: 'Rumsan',
  },
  {
    label: 'Rahat',
    value: 'Rahat',
  },
  {
    label: 'Shared',
    value: 'Shared',
  },
];

interface ListToolbarProps<TData> {
  table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[400px] bg-white"
          placeholder="Search"
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          type="text"
        />

        {table.getColumn('group') && (
          <ListFilter
            column={table.getColumn('group')}
            title="Group  "
            options={groups}
          />
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
