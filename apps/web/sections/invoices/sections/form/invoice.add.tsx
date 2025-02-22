'use client';

import { PATHS } from '@/routes/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddInvoice } from '@rumsan/raman-ui/queries/invoice.query';
import { InvoiceType } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rumsan/shadcn-ui/components/card';
import { Loader2, Receipt } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InvoiceForm } from './invoice.form';
import { Invoice, invoiceSchema } from './schema';

type InvoiceAddProps = {
  router: any;
};

const defaultValues: Invoice = {
  amount: '',
  categoryId: '',
  description: '',
  projectId: '',
  userId: '',
  currency: 'NPR',
  invoiceType: InvoiceType.ESTIMATE,
  date: new Date(),
  receipts: [] as unknown as Record<string, string>,
  vatAmount: undefined,
  approvalChallenge: '',
};

export default function InvoiceAddForm({ router }: InvoiceAddProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: saveInvoice, isPending } = useAddInvoice();

  const form = useForm<Invoice>({
    resolver: zodResolver(invoiceSchema()),
    defaultValues: defaultValues,
  });

  const handleInvoiceSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const payload = {
        ...data,
        date: data.date ? new Date(data.date).toISOString() : null,
        receipts: files,
        vatAmount: data.vatAmount ?? undefined,
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'receipts' && Array.isArray(value)) {
          value.forEach((file: any) => {
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
      await saveInvoice(formData);
      router.push(PATHS.INVOICE.HOME);
    } catch (error) {
      console.error('Error submitting invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="rounded-lg w-full max-w-4xl mx-auto mt-8 mb-8">
        <CardHeader>
          <CardTitle className="flex">
            <div className="rounded-full border flex flex-col justify-center bg-gray-100 items-center w-[30px] h-[30px]">
              <Receipt className="h-4" strokeWidth={1.75} />
            </div>
            <div className="ml-2 font-bold text-xl">New Invoice</div>
          </CardTitle>
          <CardDescription className="text-base text-sm ml-10">
            An approval request will be sent to the project owner.
          </CardDescription>
        </CardHeader>
        <hr className="w-full" />
        <CardContent className="p-0">
          <InvoiceForm
            mode="add"
            form={form}
            defaultValues={defaultValues}
            files={files}
            setFiles={setFiles}
            saveForm={handleInvoiceSubmit}
            isEditing={false}
          >
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  history.back();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="w-[170px] flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                    <span>Saving....</span>
                  </>
                ) : (
                  'Add Invoice'
                )}
              </Button>
            </div>
          </InvoiceForm>
        </CardContent>
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
          </div>
        )}
      </Card>
    </div>
  );
}
