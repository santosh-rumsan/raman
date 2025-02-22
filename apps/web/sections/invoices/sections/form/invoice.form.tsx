'use client';

import ExpenseAttachment from '@/sections/expenses/sections/form/expense.attachments';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { useLookUpList } from '@rumsan/raman-ui/queries/misc.query';
import { FileAttachment, InvoiceType } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Calendar } from '@rumsan/shadcn-ui/components/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { Label } from '@rumsan/shadcn-ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rumsan/shadcn-ui/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn-ui/components/select';
import { Textarea } from '@rumsan/shadcn-ui/components/textarea';
import { CurrencyAmountField } from '@rumsan/ui/components/currency-amount.field';
import { SelectField } from '@rumsan/ui/components/select.field';
import { StandardFormField } from '@rumsan/ui/components/standard.field';
import { format } from 'date-fns';
import { CalendarIcon, FileImage } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Invoice } from './schema';

interface InvoiceFormProps {
  mode: 'add' | 'approval' | 'reimburse';
  saveForm: (invoiceData: Invoice) => void;
  files?: File[];
  setFiles?: Dispatch<SetStateAction<File[]>>;
  fileChoose?: boolean;
  setFileChoose?: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
  defaultValues?: Invoice;
  children: React.ReactNode;
  form: UseFormReturn<Invoice>;
}

export function InvoiceForm({
  mode,
  saveForm,
  files,
  setFiles,
  defaultValues,
  children,
  form,
}: InvoiceFormProps) {
  const [isVat, setIsVat] = useState(false);

  const { categories, projects, users } = useSelectLookUp();

  const handleShowVat = (value: string) => {
    setIsVat(value === InvoiceType.VAT);
    if (value !== InvoiceType.VAT) {
      form.setValue('vatAmount', undefined);
    }
  };

  const onInvoiceTypeChange = (value: InvoiceType) => {
    form.setValue('invoiceType', value);
    handleShowVat(value);
  };

  const onAccountTypeChange = (value: any) => {
    form.setValue('accountId', value);
  };

  const handleSubmit = form.handleSubmit(
    (data) => {
      saveForm(data);
    },
    (errors) => {
      console.log('Validation errors:', errors);
    },
  );

  const handleImageClick = (attachment: any) => {
    if (attachment) {
      if (attachment.url === 'pending')
        return alert(
          'Attachment is still uploading. Refresh the page and try after few seconds.',
        );
      window.open(attachment.url, '_blank');
    }
  };

  const { data } = useLookUpList();
  const accounts = data?.accounts;

  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.invoiceType) {
      setIsVat(defaultValues.invoiceType === 'VAT');
    }
    if (mode === 'approval') {
      form.reset(defaultValues);
    } else {
      setIsVat(false);
    }
  }, [defaultValues, form, mode]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandardFormField
              name="userId"
              label="User"
              placeholder="Select user"
              disabled={mode !== 'add'}
            >
              <SelectField selectOptions={users} />
            </StandardFormField>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end ">
                  <FormLabel className="text-sm">Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button disabled={mode !== 'add'} variant={'outline'}>
                          {field.value ? (
                            format(field.value, 'MMM D, YYYY')
                          ) : (
                            <span className="font-normal">Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date: any) => {
                          field.onChange(date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
                      disabled={mode !== 'add'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <StandardFormField
              name="invoiceType"
              label="Invoice Type"
              placeholder="Select invoice type"
              disabled={mode !== 'add'}
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

            <FormField
              control={form.control}
              name="vatAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">VAT Amount</FormLabel>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center">
                      <Select disabled={mode !== 'add' || !isVat}>
                        <FormControl>
                          <SelectTrigger className="w-[180px] rounded-r-none">
                            <SelectValue placeholder="NPR" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NPR">NPR</SelectItem>
                          <SelectItem value="US$">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        disabled={mode !== 'add' || !isVat}
                        placeholder="0.00"
                        {...field}
                        className="rounded-l-none"
                        value={
                          field.value !== undefined && field.value !== null
                            ? field.value
                            : ''
                        }
                        onChange={(e) => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                      />
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <StandardFormField
              name="projectId"
              label="Project"
              placeholder="Select project"
              disabled={mode !== 'add'}
            >
              <SelectField selectOptions={projects} />
            </StandardFormField>

            <StandardFormField
              name="categoryId"
              label="Category"
              placeholder="Select category"
            >
              <SelectField selectOptions={categories} />
            </StandardFormField>
          </div>

          <div className="flex flex-col gap-2 mt-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full gap-2">
                      <Label htmlFor="message">Description</Label>
                      <Textarea
                        placeholder="Write Description"
                        id="message"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'add' ? (
              <ExpenseAttachment
                files={files ?? []}
                setFiles={setFiles || (() => {})}
                id="receipts"
              />
            ) : (
              <div className="flex flex-col gap-2 mt-8">
                <Label>Attachments</Label>
                {Array.isArray(defaultValues?.receipts) ? (
                  defaultValues?.receipts.map(
                    (attachment: FileAttachment, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-left bg-gray-50 p-2 rounded-md hover:shadow-sm hover:bg-gray-100"
                      >
                        <div
                          onClick={() => handleImageClick(attachment)}
                          className="flex items-center cursor-pointer"
                        >
                          <div className="h-8 w-8 flex items-center justify-center border rounded-full bg-gray-100">
                            <FileImage
                              className="h-4 cursor-pointer"
                              strokeWidth={1.75}
                            />
                          </div>
                          <p className="font-light text-sm text-gray-700 ml-2">
                            {attachment.filename}
                          </p>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-gray-500">Invalid attachments data</p>
                )}
              </div>
            )}
          </div>
        </div>

        <hr className="w-full" />
        <div className="w-full max-w-screen-lg mx-auto p-6 flex justify-end">
          {children}
        </div>
      </form>
    </Form>
  );
}
