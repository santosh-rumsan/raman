'use client';

import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { useLookUpList } from '@rumsan/raman-ui/queries/misc.query';
import { InvoiceType } from '@rumsan/raman/types/enums';

import { InvoiceExtended } from '@rumsan/raman/types';
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
import { CalendarIcon, FileImage, User } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface ReimburseInvoiceReimburseProps {
  saveForm: (invoiceData: InvoiceExtended) => void;
  files?: File[];
  setFiles?: Dispatch<SetStateAction<File[]>>;
  fileChoose?: boolean;
  setFileChoose?: Dispatch<SetStateAction<boolean>>;
  defaultValues?: InvoiceExtended;
  children: React.ReactNode;
  form: UseFormReturn<InvoiceExtended>;
}

export function InvoiceReimburseForm({
  saveForm,
  files,
  setFiles,
  defaultValues,
  children,
  form,
}: ReimburseInvoiceReimburseProps) {
  const [isVat, setIsVat] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

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
    } else {
      setIsVat(false);
    }
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StandardFormField
              name="userId"
              label="User"
              placeholder="Select user"
              disabled={true}
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
                        <Button disabled={true} variant={'outline'}>
                          {field.value ? (
                            format(field.value, 'MMM dd, yyyy')
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
                      disabled={true}
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
              disabled={true}
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
                      <Select
                      // disabled={true || !isVat}
                      >
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
                        disabled={true || !isVat}
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
              disabled={true}
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
          </div>

          <div className="flex flex-col gap-2 mt-7">
            <Label>Attachments</Label>
            {Array.isArray(defaultValues?.receipts) ? (
              defaultValues?.receipts.map(
                //TODO: Fix any FileAttachment
                (attachment: any, index: number) => (
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
                    {/* <button
                      //   onClick={() => handleDeleteAttachment(attachment.hash)}
                      className="flex items-center justify-center h-6 w-6 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
                    >
                      <X className="h-4 w-4" strokeWidth={1.75} />
                    </button> */}
                  </div>
                ),
              )
            ) : (
              <p className="text-gray-500">Invalid attachments data</p>
            )}
          </div>
        </div>

        <hr className="w-full" />
        <div className="p-6">
          <div className="mb-5 flex items-center justfiy-center">
            <div className="rounded-full border flex flex-col justify-center bg-gray-100 items-center w-[30px] h-[30px]">
              <User className="h-4" strokeWidth={1.75} />
            </div>
            <h5 className="text-base font-bold ml-2 text-gray-500">
              Reimbursement Details
            </h5>
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <StandardFormField
              name="accountId"
              label="Payment From"
              placeholder="Select account type"
            >
              <SelectField
                onValueChange={(value) => {
                  onAccountTypeChange(value as any);
                }}
                selectOptions={
                  accounts
                    ? Object.values(accounts).map((account) => ({
                        label: account.name,
                        value: account.cuid,
                      }))
                    : []
                }
                showClearButton={false}
              />
            </StandardFormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="reimbursedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end ">
                  <FormLabel className="text-sm">
                    Select Reimbursed Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'}>
                          {field.value ? (
                            format(field.value, 'MMM dd, yyyy')
                          ) : (
                            <span className="font-normal">
                              Select reimbursed date
                            </span>
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
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2 mt-8">
            <FormField
              control={form.control}
              name="reimbursedRemarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full gap-2">
                      <Label htmlFor="message">Reimbursed Remarks</Label>
                      <Textarea
                        placeholder="Write reimbursed remarks"
                        id="message"
                        className="min-h-[80px]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
