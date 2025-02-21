'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rumsan/shadcn-ui/components/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DepartmentEdit } from '../form/department.edit';

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
}
//TODO: fix any
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>): any {
  const router = useRouter();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditDialogOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DepartmentEdit
        row={row.original}
        isOpen={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />
    </>
  );
}
