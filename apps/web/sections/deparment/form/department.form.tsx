'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLookUpList } from '@rumsan/raman-ui/queries/misc.query';
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
import groups from '../group.json';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { departmentSchema } from './schema';

type userData = {
  cuid: string;
  name: string;
};

interface CommonDepartmentFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;

  isEdit?: boolean;
  onCancel?: () => void;
}
//TODO: fix any
export function CommonDepartmentForm({
  onSubmit,
  defaultValues,

  isEdit = false,
  onCancel,
}: CommonDepartmentFormProps): any {
  const userList = useLookUpList();

  type FormData = z.infer<typeof departmentSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Department Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter department name"
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
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Select Group</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups?.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Department Owner</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department Owner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userList?.data?.users?.map((user: userData) => (
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
}
