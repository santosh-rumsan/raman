'use client';

import { useEditProject } from '@rumsan/raman-ui/queries/project.query';
import { EditProject } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rumsan/shadcn-ui/components/dialog';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';

import { useState } from 'react';
import { CommonProjectForm } from './project.form';

interface ProjectEditProps {
  row: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectEdit({ row, isOpen, onClose }: ProjectEditProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const editProject = useEditProject();
  const { toast } = useToast();

  const onSubmit = async (data: EditProject) => {
    try {
      if (row.cuid) {
        await editProject.mutateAsync({ id: row.cuid, data });

        toast({
          description: 'Project edited successfully',
        });

        setDialogOpen(false);
      } else {
        console.error('project or its ID is undefined');
      }
    } catch (error) {
      console.error('Failed to edit department:', error);

      toast({
        variant: 'destructive',
        description: 'Failed to edit project',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Update the project details
          </DialogDescription>
        </DialogHeader>

        <CommonProjectForm
          onSubmit={onSubmit}
          defaultValues={{
            name: row.name,
            departmentId: row.departmentId,
            owner: row.owner,
          }}
          isEdit={true}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
