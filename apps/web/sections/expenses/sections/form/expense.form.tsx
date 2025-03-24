'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Calendar } from '@rumsan/shadcn-ui/components/calendar';
import {
  Card,
  CardContent,
  CardDescription,
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

import { zodResolver } from '@hookform/resolvers/zod';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { useProjectList } from '@rumsan/raman-ui/queries/project.query';
import { InvoiceType } from '@rumsan/raman/types/enums';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Input } from '@rumsan/shadcn-ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rumsan/shadcn-ui/components/popover';
import { Textarea } from '@rumsan/shadcn-ui/components/textarea';
import { CurrencyAmountField } from '@rumsan/ui/components/currency-amount.field';
import { SelectField } from '@rumsan/ui/components/select.field';
import { StandardFormField } from '@rumsan/ui/components/standard.field';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import ExpenseAttachment from './expense.attachments';
import { Expense, expenseSchema } from './schema';

interface ExpenseBaseProps {
  mode: 'add' | 'edit';
  saveForm: (expenseData: Expense) => void; // Update 'any' with the specific type for the expense data if available
  files?: File[];
  setFiles?: Dispatch<SetStateAction<File[]>>;
  fileChoose?: boolean;
  setFileChoose?: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  Values?: Expense;
  defaultValues?: Expense;
  expenseId?: string;
}

export default function ExpenseBase({
  mode,
  saveForm,
  files,
  setFiles,
  fileChoose,
  setFileChoose,
  isEditing,
  isSubmitting,
  setIsSubmitting,
  defaultValues,
  Values,
  expenseId,
}: ExpenseBaseProps) {
  const [isDepartmentFieldDisabled, setIsDepartmentFieldDisabled] =
    useState(false);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showVat, setShowVat] = useState(
    defaultValues?.invoiceType === 'VAT' &&
      defaultValues?.vatAmount !== undefined,
  );
  const { accounts, categories, departments, projects } = useSelectLookUp();
  const projectList = useProjectList({ page: 1, limit: 500 });

  const form = useForm<Expense>({
    resolver: zodResolver(expenseSchema),
    defaultValues: defaultValues,
    mode:'onChange'
  });

  const onProjectChange = (value: string) => {
    const projectDetails = projectList?.data?.data?.find(
      (project) => project.cuid === value,
    );
    if (projectDetails?.departmentId) {
      form.setValue('departmentId', projectDetails.departmentId);
      setIsDepartmentFieldDisabled(true);
    } else {
      form.setValue('departmentId', '');
      setIsDepartmentFieldDisabled(false);
    }
    form.setValue('projectId', value);
  };

  const handleShowVat = (value: string) => {
    setShowVat(value === InvoiceType.VAT);
    if (value !== InvoiceType.VAT) {
      form.setValue('vatAmount', 0);
    }
  };

  const onInvoiceTypeChange = (value: InvoiceType) => {
    form.setValue('invoiceType', value);
    handleShowVat(value);
  };

    const handleSubmit = form.handleSubmit(
    (data) => {
      saveForm(data);
    },
    (errors) => {
      console.log('Validation errors:', errors);
    },
  );

  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.invoiceType) {
      setShowVat(defaultValues.invoiceType === 'VAT');
    }
    if (mode === 'edit' && defaultValues?.projectId) {
      setIsDepartmentFieldDisabled(true);
    }
  }, [defaultValues, mode]);

  return (
    <div>
      <Card className="rounded-lg w-full max-w-4xl mx-auto my-4">
        <CardHeader>
          <CardTitle className="font-bold text-xl">
            {isEditing ? 'Edit Expense' : 'Add Expense'}
          </CardTitle>
          <CardDescription className="text-base">
            {isEditing
              ? 'Edit the Expense Detail'
              : 'Create a new expense detail'}
          </CardDescription>
        </CardHeader>

        <hr className="w-full mb-3" />
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Picker */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
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

                <FormField
                  control={form.control}
                  name="amount"
                  render={() => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <CurrencyAmountField
                          currencyName="currency"
                          amountName="amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <StandardFormField
                  name="projectId"
                  label="Project"
                  placeholder="Select project"
                >
                  <SelectField
                    onValueChange={(value) => {
                      onProjectChange(value);
                    }}
                    onClear={() => {
                      form.setValue('departmentId', '');
                      setIsDepartmentFieldDisabled(false);
                    }}
                    selectOptions={projects}
                  />
                </StandardFormField>

                <StandardFormField
                  name="departmentId"
                  label="Department"
                  placeholder="Select department"
                  disabled={isDepartmentFieldDisabled}
                >
                  <SelectField selectOptions={departments} />
                </StandardFormField>

                <StandardFormField
                  name="categoryId"
                  label="Category"
                  placeholder="Select category"
                >
                  {/* TODO: Add AutoCompleteField component
                  https://leonardomontini.dev/shadcn-autocomplete/ */}
                  <SelectField selectOptions={categories} />
                </StandardFormField>

                <StandardFormField
                  name="accountId"
                  label="Account"
                  placeholder="Select account"
                >
                  <SelectField selectOptions={accounts} />
                </StandardFormField>

                <StandardFormField
                  name="invoiceType"
                  label="Invoice Type"
                  placeholder="Select invoice type"
                >
                  <SelectField
                    onValueChange={(value) => {
                      onInvoiceTypeChange(value as InvoiceType);
                    }}
                    selectOptions={Object.values(InvoiceType).map((type) => ({
                      label: type,
                      value: type,
                    }))}
                    showClearButton={false}
                  />
                </StandardFormField>

                {/* VAT Amount */}

                <FormField
                  control={form.control}
                  name="vatAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Amount</FormLabel>
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
                                form.trigger('vatAmount'),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

              {/* Remarks */}
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attachments */}
              {mode === 'add' && (
                <ExpenseAttachment
                  files={files ?? []}
                  setFiles={setFiles || (() => {})}
                  id="attachments"
                />
              )}

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
                    'Add Expense'
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
