'use client';

import { useGetApproval } from '@rumsan/raman-ui/queries/approval.query';
import { format } from 'date-fns';
import { Frown, Smile } from 'lucide-react';

export function InvoiceDisposition({
  approvalChallenge,
}: {
  approvalChallenge: string;
}) {
  const findInvoice = useGetApproval(approvalChallenge);
  const invoiceDetails = findInvoice?.data;

  const statusColor =
    invoiceDetails?.status === 'REJECTED' ? 'text-red-600' : 'text-green-600';
  const emoji = invoiceDetails?.status === 'APPROVED' ? <Smile /> : <Frown />;

  const createdAt = invoiceDetails?.createdAt
    ? new Date(invoiceDetails.createdAt)
    : null;

  const formattedDate = createdAt
    ? format(createdAt, 'MMM dd, yyyy')
    : 'Unknown Date';

  return (
    <div className="relative grid grid-row-2 text-center justify-center items-center h-screen text-xl overflow-hidden">
      <div className="grid justify-center items-center">
        <h1 className={`flex justify-center text-center ${statusColor}`}>
          {emoji}
        </h1>
        <h1 className="flex items-center gap-2 mt-4">
          {' '}
          {`The `}
          <b>{`${invoiceDetails?.description} - ${formattedDate}`}</b>
          {` invoice has been `}
          <b className={`${statusColor}`}>{invoiceDetails?.status}.</b>
        </h1>
      </div>
    </div>
  );
}
