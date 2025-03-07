'use client';

import { useAddDepartment } from '@rumsan/raman-ui/queries/department.query';
import { CreateDepartment } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rumsan/shadcn-ui/components/dialog';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { AlertError } from '@rumsan/ui/components/alert.error';

import { ReactNode, useState } from 'react';
import { CommonDepartmentForm } from './department.form';

export function DepartmentAdd({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const addDepartment = useAddDepartment();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: CreateDepartment) => {
    try {
      await addDepartment.mutateAsync(data);
      toast({
        description: 'Department added successfully',
      });

      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to add department:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to add department',
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertError title="Error" message="" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Add Department</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Create a new department
          </DialogDescription>
        </DialogHeader>
        <CommonDepartmentForm
          onSubmit={onSubmit}
          defaultValues={{ name: '', group: '', owner: '' }}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
