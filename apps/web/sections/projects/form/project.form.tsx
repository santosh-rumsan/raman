import { zodResolver } from '@hookform/resolvers/zod';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { Department } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { DialogClose, DialogFooter } from '@rumsan/shadcn-ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import { Input } from '@rumsan/shadcn-ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn-ui/components/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { projectSchema } from './schema';

type userData = {
  cuid: string;
  name: string;
};

interface CommonProjectFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;

  isEdit?: boolean;
  onCancel?: () => void;
}

export const CommonProjectForm = ({
  // form,
  onSubmit,
  defaultValues,
  isEdit = false,
  onCancel,
}: CommonProjectFormProps) => {
  type FormData = z.infer<typeof projectSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  const { departments, users } = useSelectLookUp();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Project Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter project name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger('name');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Department</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments
                    ?.filter(
                      (department: Department) => department.cuid !== undefined,
                    )
                    .map((department: Department) => (
                      <SelectItem
                        key={department.cuid}
                        value={department.cuid!}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Project Owner</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project Owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((user: userData) => (
                    <SelectItem key={user.cuid ?? ''} value={user.cuid ?? ''}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <DialogFooter className="mx-auto sm:justify-center mt-3">
          <DialogClose asChild>
            <Button
              className="min-w-[12rem] "
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button className="min-w-[12rem] fw-[600]" type="submit">
            {isEdit ? 'Save Changes' : 'Add'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
