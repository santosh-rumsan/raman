'use client';
import { useAddCategory } from '@rumsan/raman-ui/queries/category.query';
import { CreateCategory } from '@rumsan/raman/types';
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
import { CommonCategoryForm } from './categories.form';

export function CategoryAdd({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const addCategory = useAddCategory();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: CreateCategory) => {
    try {
      await addCategory.mutateAsync(data);
      toast({
        variant: 'success',
        description: 'Category added successfully',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to add category:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to add category',
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertError title="Error" message="" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Create a new category
          </DialogDescription>
        </DialogHeader>
        <CommonCategoryForm
          onSubmit={onSubmit}
          defaultValues={{ name: '', group: '' }}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
