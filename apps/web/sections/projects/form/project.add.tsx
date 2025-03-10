'use client';

import { useAddProject } from '@rumsan/raman-ui/queries/project.query';
import { Project } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rumsan/shadcn-ui/components/dialog';

import { ReactNode, useState } from 'react';

import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { AlertError } from '@rumsan/ui/components/alert.error';
import { CommonProjectForm } from './project.form';

export function ProjectAdd({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const addProject = useAddProject();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: Project) => {
    try {
      await addProject.mutateAsync(data);
      toast({
        variant: 'success',
        description: 'Project added successfully',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to add project:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to add project',
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertError title="Error" message="" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Create a new project
          </DialogDescription>
        </DialogHeader>
        <CommonProjectForm
          onSubmit={onSubmit}
          defaultValues={{ name: '', departmentId: '', owner: '' }}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
