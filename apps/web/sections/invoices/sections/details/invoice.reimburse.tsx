import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Calendar } from '@rumsan/shadcn-ui/components/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rumsan/shadcn-ui/components/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';

import { PATHS } from '@/routes/paths';
import ExpenseAttachment from '@/sections/expenses/sections/form/expense.attachments';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { useInvoiceReimburse } from '@rumsan/raman-ui/queries/invoice.query';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rumsan/shadcn-ui/components/popover';
import { Textarea } from '@rumsan/shadcn-ui/components/textarea';
import { SelectField } from '@rumsan/ui/components/select.field';
import { StandardFormField } from '@rumsan/ui/components/standard.field';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Reimbursement, reimbursementSchema } from './schema';

interface ReimbursementFormProps {
  cuid: string;
  formData: Reimbursement | null;
  setFormData: (data: Reimbursement | null) => void;
}

export default function ReimbursementForm({
  cuid,
  formData,
  setFormData,
}: ReimbursementFormProps) {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { accounts, categories } = useSelectLookUp();
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: saveForm, isPending } = useInvoiceReimburse();

  const isSubmitting = false; // Replace with actual loading state

  const form = useForm<Reimbursement>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: formData || {},
  });

  useEffect(() => {
    if (formData) {
      form.reset(formData);
    }
  }, [formData, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    //const data = formData as ReceiptReimbursement;

    const payload = {
      ...data,
      date: data.date ? new Date(data.date || '').toISOString() : null,
      attachments: files,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === 'attachments' && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof Blob || typeof file === 'string') {
            formData.append(key, file);
          } else {
            console.error('Invalid file type:', file);
          }
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const { expense } = await saveForm({ id: cuid, data: formData }); // Query execution
    console.log(expense);
    router.push(PATHS.EXPENSE.DETAILS(expense.cuid));
  });

  return (
    <div>
      <Card className="rounded-lg w-full mx-auto">
        <CardHeader>
          <CardTitle className="font-bold text-md">
            Reimbursement Form
          </CardTitle>
        </CardHeader>

        <hr className="w-full mb-3" />
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 px-4">
                {/* Reimbursement Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Reimbursement Date</FormLabel>
                        <Popover
                          open={isPopoverOpen}
                          onOpenChange={setIsPopoverOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && 'text-muted-foreground'
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setIsPopoverOpen(false);
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('2022-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reimbursed Amount</FormLabel>
                        <FormControl>
                          <Input
                            className="text-right"
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? String(e.target.value)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bank Transfer Fees */}
                  <FormField
                    control={form.control}
                    name="bankTransferFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Transfer Fees</FormLabel>
                        <FormControl>
                          <Input
                            className="text-right"
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? String(e.target.value)
                                  : undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category */}
                <StandardFormField
                  name="categoryId"
                  label="Category"
                  placeholder="Select category"
                >
                  {/* TODO: Add AutoCompleteField component
                                  https://leonardomontini.dev/shadcn-autocomplete/ */}
                  <SelectField selectOptions={categories} />
                </StandardFormField>

                {/* Bank Account */}
                <StandardFormField
                  name="accountId"
                  label="Account"
                  placeholder="Select account"
                >
                  <SelectField selectOptions={accounts} />
                </StandardFormField>

                {/* Remarks */}
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write remarks"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Attachments */}
                <ExpenseAttachment
                  files={files ?? []}
                  setFiles={setFiles || (() => {})}
                  id="attachments"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    history.back();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 text-white" />
                      <span>Saving....</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
          </div>
        )}
      </Card>
    </div>
  );
}
