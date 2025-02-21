'use client';

import { useEditCategory } from '@rumsan/raman-ui/queries/category.query';
import { EditCategory } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rumsan/shadcn-ui/components/dialog';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { useState } from 'react';
import { CommonCategoryForm } from './categories.form';

interface CategoryEditProps {
  row: any;
  isOpen: boolean;
  onClose: () => void;
}
export function CategoryEdit({ row, isOpen, onClose }: CategoryEditProps) {
  const { toast } = useToast();
  const editCategory = useEditCategory();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: EditCategory) => {
    try {
      if (row.cuid) {
        await editCategory.mutateAsync({ id: row.cuid, data });
      } else {
        console.error('Category ID is undefined');
      }
      toast({
        description: 'Category updated successfully',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to edit category:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Update the category details
          </DialogDescription>
        </DialogHeader>
        <CommonCategoryForm
          onSubmit={onSubmit}
          defaultValues={{ name: row.name, group: row.group }}
          isEdit={true}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
