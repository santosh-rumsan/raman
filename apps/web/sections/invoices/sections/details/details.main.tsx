'use client';

import { PATHS } from '@/routes/paths';
import { useGetInvoice } from '@rumsan/raman-ui/queries/invoice.query';
import { Invoice } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { ChevronLeft, Handshake } from 'lucide-react';
import { useState } from 'react';
import InvoiceDetailCard from './details.card';
import InvoiceReimbursedDetails from './details.reimbursed';
import InvoiceRejectedDetails from './details.reject';
import { ReceiptCard } from './receipt.card';

type InvoiceDetailsProps = {
  router: any;
  invoiceId: string;
};

type StatusColors = {
  PENDING: string;
  REJECTED: string;
  REIMBURSED: string;
  APPROVED: string;
};

export default function InvoiceDetails({
  router,
  invoiceId,
}: InvoiceDetailsProps) {
  const [isRejected, setIsRejected] = useState(false);

  const { data: invoiceDetails } = useGetInvoice(invoiceId);

  const invoice: Invoice = invoiceDetails?.data as unknown as Invoice;

  const statusColors: StatusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    REJECTED: 'bg-red-50 text-red-600',
    REIMBURSED: 'bg-green-50 text-green-800',
    APPROVED: 'bg-blue-50 text-blue-500',
  };

  const handleBackButton = () => {
    router.push(PATHS.INVOICE.HOME);
  };

  const handleReimburse = () => {
    if (invoice?.status === 'PENDING' || invoice?.status === 'REJECTED') {
      setIsRejected(!isRejected);
    } else {
      router.push(PATHS.INVOICE.REIMBURSE(invoiceId));
    }
  };

  const handleImageClick = (receipt: string) => {
    if (receipt) {
      const imageUrl = `${receipt}`;
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center my-3">
        <div className="flex items-start gap-1">
          <div className="m-auto items-center justify-center">
            <ChevronLeft
              className="h-5 w-5 cursor-pointer"
              onClick={handleBackButton}
            />
          </div>

          <div className="flex flex-col gap-1 ml-1">
            <h1 className="text-xl font-bold text-gray-900">Invoice Details</h1>
            <p className="text-gray-500 text-sm">
              Here is the detailed view of the selected invoice
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-right ml-auto">
          <div className="flex items-center justify-center w-[128px] h-[35px] text-sm gap-2 text-center text-blue-500 rounded-md">
            {invoice?.status === 'APPROVED' ? (
              <Button
                variant="outline"
                className="border-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={handleReimburse}
              >
                <Handshake className="h-10 w-10" strokeWidth={2.5} />
                Reimburse
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {invoice?.status === 'REJECTED' && (
          <InvoiceRejectedDetails className="col-span-12" invoice={invoice} />
        )}
        <InvoiceDetailCard className="col-span-8" invoice={invoice} />
        <ReceiptCard
          className="col-span-4"
          invoice={invoice}
          // addAttachmentHandler={addAttachmentHandler}
          // deleteAttachmentHandler={deleteAttachmentHandler}
          // loadingState={loadingAttachment}
        />
      </div>

      {invoice?.status === 'REIMBURSED' && (
        <InvoiceReimbursedDetails className="col-span-12" invoice={invoice} />
      )}
    </div>
  );
}
