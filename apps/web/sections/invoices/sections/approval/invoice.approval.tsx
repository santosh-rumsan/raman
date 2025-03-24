'use client';
import { useGetApproval } from '@rumsan/raman-ui/queries/approval.query';
import { InvoiceExtended } from '@rumsan/raman/types';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReceiptViewer from '../details/attachment';
import InvoiceDetails from '../details/details';
import { ReceiptApprovalDialog } from './invoice.approval.dialog';

type ReimburseInvoiceAddProps = {
  invoiceChallenge: string;
};

export default function InvoiceApproval({
  invoiceChallenge,
}: ReimburseInvoiceAddProps) {
  const router = useRouter();
  const receiptDetails = useGetApproval(invoiceChallenge);

  const receipt: InvoiceExtended =
    receiptDetails?.data as unknown as InvoiceExtended;

  if (receipt) {
    receipt.date = new Date(receipt?.date || '');
  }
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const statusColor =
    receipt?.status === 'REJECTED' ? 'text-red-600' : 'text-green-600';

  return (
    <>
      {/* <div className="grid grid-cols-4 gap-6 px-6 h-screen m-20"> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-20 px-6">
        <div>
          <div className="sticky top-0">
            <div className="flex items-center mb-4">
              <div className="font-bold text-2xl mx-2">
                Receipt Approval Request
              </div>
              <div>
                {receipt?.status === 'APPROVED' && (
                  <CheckCircle
                    className="h-5 w-5 text-green-600 text-bold"
                    strokeWidth={3}
                  />
                )}
              </div>
            </div>

            <InvoiceDetails receipt={receipt} />
            <div className="p-4">
              <span className="text-red-800 text-sm">
                ***Note: Please review the receipt properly before approving.
                This expense will be applied towards your project or department.
                If wrong project or department has been specified. Please reject
                it with a reason. User needs to resubmit it with correct project
                or department.
              </span>
            </div>
            <div className="flex justify-end mt-2 w-full">
              {receipt ? (
                receipt?.status === 'REJECTED' ||
                receipt?.status === 'APPROVED' ? (
                  <div className="mt-1 mr-4">
                    This receipt has been{' '}
                    <b className={statusColor}> {receipt?.status}</b>
                    {'.'}
                  </div>
                ) : (
                  <div className="flex gap-2 px-2">
                    <ReceiptApprovalDialog
                      invoiceChallange={invoiceChallenge}
                      approvalType="REJECTION"
                    />
                    <ReceiptApprovalDialog
                      invoiceChallange={invoiceChallenge}
                      approvalType="APPROVAL"
                    />
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto">
          <ReceiptViewer receipt={receipt} />
        </div>
      </div>
    </>
  );
}
