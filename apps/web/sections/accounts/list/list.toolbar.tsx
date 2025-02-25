'use client';

import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { ListFilter } from '@rumsan/ui/components/data-table/datatable.filter';
import { DataTableViewOptions } from '@rumsan/ui/components/data-table/datatable.options.view';
import { Table } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import { AccountAdd } from '../form/accounts.add';
//import { DepartmentAdd } from '../form/department.add copy';

interface ListToolbarProps<TData> {
    table: Table<TData>;
}

export function ListToolbar<T>({ table }: ListToolbarProps<T>) {
    const { accounts } = useSelectLookUp();
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    className="h-8 w-[150px] lg:w-[400px] bg-white"
                    placeholder="Search Account"
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    type="text"
                />

                {table.getColumn('currency') && (
                    <ListFilter
                        column={table.getColumn('currency')}
                        title="Currency"
                        options={accounts}
                    />
                )}
                {table.getColumn('acctNumber') && (
                    <ListFilter
                        column={table.getColumn('acctNumber')}
                        title="Account Number"
                        options={accounts}
                    />
                )}
                {table.getColumn('balance') && (
                    <ListFilter
                        column={table.getColumn('balance')}
                        title="Balance"
                        options={accounts}
                    />
                )}
            </div>
            <DataTableViewOptions table={table} />

            <AccountAdd>
                <Button className="m-auto text-sm h-8 ml-2 px-3">
                    <PlusCircle className="h-5 w-5" />
                    Add
                </Button>
            </AccountAdd>
        </div>
    );
}
