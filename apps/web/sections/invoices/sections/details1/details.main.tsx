'use client';

import { useWebSocketEvent } from '@/hooks/ws-event.hook';
import { PATHS } from '@/routes/paths';
import { useGetInvoice } from '@rumsan/raman-ui/queries/invoice.query';
import { EVENTS } from '@rumsan/raman/constants/events';
import { InvoiceExtended, InvoiceStatusType } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { Handshake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import InvoiceDetailCard from './details.card';
import InvoiceReimbursedDetails from './details.reimbursed';
import InvoiceRejectedDetails from './details.reject';
import { ReceiptCard } from './receipt.card';

type InvoiceDetailsProps = {
  invoiceId: string;
};

type StatusColors = {
  PENDING: string;
  REJECTED: string;
  REIMBURSED: string;
  APPROVED: string;
};

export default function InvoiceDetails({ invoiceId }: InvoiceDetailsProps) {
  const router = useRouter();
  const [isRejected, setIsRejected] = useState(false);

  const invoiceDetails = useGetInvoice(invoiceId);
  const invoice = invoiceDetails?.data as InvoiceExtended;

  useWebSocketEvent(EVENTS.INVOICE.UPLOAD, invoiceDetails.refetch);

  const statusColors: StatusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    REJECTED: 'bg-red-50 text-red-600',
    REIMBURSED: 'bg-green-50 text-green-800',
    APPROVED: 'bg-blue-50 text-blue-500',
  };

  const handleReimburse = () => {
    if (invoice?.status === 'PENDING' || invoice?.status === 'REJECTED') {
      setIsRejected(!isRejected);
    } else {
      router.push(PATHS.RECEIPT.REIMBURSE(invoiceId));
    }
  };

  return (
    <div className="px-6">
      {/* <div className="flex justify-between items-center">
        <div className="flex gap-4 text-right">
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
      </div> */}

      <div className="flex justify-between items-center mb-3">
        <div className="flex items-start gap-1"></div>
        {invoice?.status === InvoiceStatusType.APPROVED ? (
          <Button onClick={handleReimburse}>
            <Handshake className="h-10 w-10" strokeWidth={2.5} />
            Reimburse
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {invoice?.status === InvoiceStatusType.REJECTED && (
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

      {invoice?.status === InvoiceStatusType.REIMBURSED && (
        <InvoiceReimbursedDetails className="col-span-12" invoice={invoice} />
      )}
    </div>
  );
}
