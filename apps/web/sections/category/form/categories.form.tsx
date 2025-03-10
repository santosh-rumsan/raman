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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { categorySchema } from './schema';

interface CommonCategoryFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;

  isEdit?: boolean;
  onCancel?: () => void;
}

export function CommonCategoryForm({
  onSubmit,
  defaultValues,

  isEdit = false,
  onCancel,
}: CommonCategoryFormProps) {
  type FormData = z.infer<typeof categorySchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues,
  });
  const data = useLookUpList();

  const groups = Array.from(
    new Set(data?.data?.categories.map((category) => category.group)),
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name"
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
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mx-auto sm:justify-center mt-3">
          <DialogClose asChild>
            <Button
              className="min-w-[12rem]"
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
