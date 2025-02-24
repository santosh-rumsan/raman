'use client';

import { PATHS } from '@/routes/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetInvoice,
  useInvoiceReimburse,
} from '@rumsan/raman-ui/queries/invoice.query';
import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rumsan/shadcn-ui/components/card';
import { Loader2, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { InvoiceReimburseForm } from './invoice.reimburse.form';
import { Invoice, invoiceSchema } from './schema';

type InvoiceAddProps = {
  cuid: string;
};

export default function InvoiceReimburse({ cuid }: InvoiceAddProps) {
  const router = useRouter();
  const invoiceData = useGetInvoice(cuid);

  const { mutateAsync: reimburseInvoice, isPending } = useInvoiceReimburse();

  const invoiceDetails = invoiceData?.data?.data;

  if (invoiceDetails?.date) {
    invoiceDetails.date = new Date(invoiceDetails.date || '');
  }

  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<Invoice>({
    resolver: zodResolver(
      invoiceSchema({
        accountId: z.string().min(1, 'Payment account is required'),
        reimbursedDate: z.date().refine((date) => !isNaN(date.getTime()), {
          message: 'Reimbursed date must be a valid date',
        }),
        reimbursedRemarks: z.string().min(1, 'Reimbursed Remarks is required'),
      }),
    ),
    defaultValues: invoiceData?.data,
  });

  const handleInvoiceSubmit = async (data: Invoice) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const payload = {
        ...data,
        reimbursedDate: data.reimbursedDate
          ? new Date(data.reimbursedDate).toISOString()
          : null,
        reimbursedRemarks: data.reimbursedRemarks,
        accountId: data.accountId,
      };

      await reimburseInvoice({ id: cuid, data: payload });
      router.push(PATHS.INVOICE.HOME);
    } catch (error) {
      console.error('Error submitting invoice:', error);
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
          <InvoiceReimburseForm
            form={form}
            defaultValues={invoiceDetails}
            files={files}
            setFiles={setFiles}
            saveForm={handleInvoiceSubmit}
          >
            <Button
              type="submit"
              variant="default"
              className="w-[170px] flex justify-center items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                  <span>Reimbursing....</span>
                </>
              ) : (
                'Reimbusre'
              )}
            </Button>
          </InvoiceReimburseForm>
        </CardContent>
      </Card>
    </div>
  );
}
