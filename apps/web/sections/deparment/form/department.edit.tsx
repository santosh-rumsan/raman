'use client';

import { useEditDepartment } from '@rumsan/raman-ui/queries/department.query';
import { EditDepartment } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rumsan/shadcn-ui/components/dialog';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';

import { useState } from 'react';
import { CommonDepartmentForm } from './department.form';

interface DepartmentEditProps {
  row: any;
  isOpen: boolean;
  onClose: () => void;
}
//TODO: fix any
export function DepartmentEdit({
  row,
  isOpen,
  onClose,
}: DepartmentEditProps): any {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const editDepartment = useEditDepartment();
  const { toast } = useToast();

  const onSubmit = async (data: EditDepartment) => {
    try {
      if (row.cuid) {
        await editDepartment.mutateAsync({ id: row.cuid, data });

        toast({
          description: 'Department edited successfully',
        });

        // setDialogOpen(false);
        onClose()
      } else {
        console.error('Department or its ID is undefined');
      }
    } catch (error) {
      console.error('Failed to edit department:', error);

      toast({
        variant: 'destructive',
        description: 'Failed to edit department',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Update the department details
          </DialogDescription>
        </DialogHeader>
        <CommonDepartmentForm
          onSubmit={onSubmit}
          defaultValues={{ name: row.name, group: row.group, owner: row.owner }}
          isEdit={true}
          onCancel={() => {
            onClose()
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
