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

interface DataTableRowActionsProps<TData> {
  row: Row<any>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  return (
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
            router.push(`/expenses/${row.original.cuid}`);
          }}
        >
          View
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/expenses/${row.original.cuid}/edit`);
          }}
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
