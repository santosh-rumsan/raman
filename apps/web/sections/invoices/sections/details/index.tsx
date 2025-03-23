import { useWebSocketEvent } from '@/hooks/ws-event.hook';
import { AppStyles } from '@/misc/app.style';
import { PATHS } from '@/routes/paths';
import { useGetInvoice } from '@rumsan/raman-ui/queries/invoice.query';
import { EVENTS } from '@rumsan/raman/constants/events';
import { InvoiceExtended } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { invoiceStatusColors, ReceiptStatusColors } from '../list/list.column';
import ReceiptViewer from './attachment';
import InvoiceDetails from './details';
import ReimbursementForm from './invoice.reimburse';
import { Reimbursement } from './schema';

export default function ReceiptDetails(props: { receiptId: string }) {
  const router = useRouter();
  const [showReimburseForm, setShowReimburseForm] = useState(false);
  const [formData, setFormData] = useState<Reimbursement | null>(null);
  const receiptDetails = useGetInvoice(props.receiptId);
  useWebSocketEvent(EVENTS.INVOICE.UPLOAD, receiptDetails.refetch);
  const receipt: InvoiceExtended =
    receiptDetails?.data as unknown as InvoiceExtended;

  useEffect(() => {
    if (!showReimburseForm) {
      setFormData(null);
    }
  }, [showReimburseForm]);

  return (
    <div className="grid grid-cols-4 gap-6 px-6 h-screen">
      {receipt ? (
        <>
          <div className="col-span-2 relative">
            <InvoiceDetails
              className="col-span-2 sticky top-4 self-start"
              receipt={receipt}
            />
            <div className="flex justify-between mt-4 w-full">
              <div className="ml-1">
                This receipt has been{' '}
                <b
                  className={
                    invoiceStatusColors[
                      receipt.status as keyof ReceiptStatusColors
                    ]
                  }
                >
                  {' '}
                  {receipt?.status}
                </b>
                {'.'}
              </div>
              {receipt ? (
                receipt?.status === 'APPROVED' ? (
                  !showReimburseForm ? (
                    <Button
                      className={`mr-1 bg-green-700 ${AppStyles.button}`}
                      onClick={() => setShowReimburseForm(true)}
                    >
                      Reimburse
                    </Button>
                  ) : (
                    <Button
                      className={`mr-1 ${AppStyles.button}`}
                      onClick={() => setShowReimburseForm(false)}
                    >
                      View Receipt
                    </Button>
                  )
                ) : receipt?.status === 'REIMBURSED' ? (
                  <Button
                    className={`mr-1 bg-blue-700 ${AppStyles.button}`}
                    onClick={() =>
                      router.push(PATHS.EXPENSE.DETAILS(receipt?.Expense.cuid))
                    }
                  >
                    Go to Expense
                  </Button>
                ) : null
              ) : null}
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-4 overflow-y-auto">
            {showReimburseForm ? (
              <ReimbursementForm
                cuid={receipt.cuid}
                formData={formData}
                setFormData={setFormData}
              />
            ) : (
              <ReceiptViewer receipt={receipt} />
            )}
          </div>
        </>
      ) : (
        <div className="col-span-1 mx-auto">Receipt not found.</div>
      )}
    </div>
  );
}
