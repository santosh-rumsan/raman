'use client';

import { PATHS } from '@/routes/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetApproval,
  useInvoiceApproval,
} from '@rumsan/raman-ui/queries/approval.query';
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
import { InvoiceForm } from '../form/invoice.form';
import { Invoice, invoiceSchema } from '../form/schema';
import { InvoiceReject } from './invoice.reject';

type ReimburseInvoiceAddProps = {
  invoiceChallenge: string;
};

export default function InvoiceApproval({
  invoiceChallenge,
}: ReimburseInvoiceAddProps) {
  const router = useRouter();
  const invoiceData = useGetApproval(invoiceChallenge);
  const { mutateAsync: approveInvoice, isPending } = useInvoiceApproval();

  const invoiceDetails = invoiceData?.data as unknown as Invoice;
  if (invoiceDetails) {
    invoiceDetails.date = new Date(invoiceDetails?.date || '');
  }
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const form = useForm<Invoice>({
    resolver: zodResolver(invoiceSchema()),
    defaultValues: invoiceDetails,
  });

  const handleApprove = async (data: Invoice) => {
    try {
      const payload: any = {
        categoryId: data.categoryId,
        description: data.description,
      };

      await approveInvoice({
        id: invoiceChallenge,
        data: payload,
      });
      router.push(PATHS.INVOICE.DISPOSITION(invoiceChallenge));
    } catch (error) {
      console.error('Failed to add reason:', error);
    }
  };

  const statusColor =
    invoiceDetails?.status === 'REJECTED' ? 'text-red-600' : 'text-green-600';

  return (
    <>
      <div>
        <Card className="rounded-lg w-full max-w-4xl mx-auto mt-8 mb-8">
          <CardHeader>
            <CardTitle className="flex">
              <div className="rounded-full border flex flex-col justify-center bg-gray-100 items-center w-[30px] h-[30px]">
                <Receipt className="h-4" strokeWidth={1.75} />
              </div>
              <div className="ml-2 font-bold text-xl">
                Invoice Approval Request
              </div>
            </CardTitle>
            <CardDescription className="text-base text-sm ml-10">
              Approve or reject the invoice
            </CardDescription>
          </CardHeader>
          <hr className="w-full" />
          <InvoiceReject
            show={showRejectDialog}
            setShow={setShowRejectDialog}
            invoiceChallange={invoiceChallenge}
          />
          <CardContent className="p-0">
            <InvoiceForm
              mode="approval"
              form={form}
              saveForm={handleApprove}
              isEditing={true}
              defaultValues={invoiceDetails}
            >
              {invoiceDetails?.status === 'REJECTED' ||
              invoiceDetails?.status === 'APPROVED' ? (
                <p>
                  {`This invoice has already been `}
                  <b className={statusColor}> {invoiceDetails?.status}</b>
                  {`.`}
                </p>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2 w-[170px]"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    Reject
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    className="w-[170px] flex justify-center items-center gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 text-white" />
                        <span>Approving....</span>
                      </>
                    ) : (
                      'Approve'
                    )}
                  </Button>
                </>
              )}
            </InvoiceForm>
          </CardContent>
        </Card>
      </div>
      {/* <InvoiceApproveDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        onApprove={handleApprove}
        inv={invoiceDetails}
      /> */}
    </>
  );
}
