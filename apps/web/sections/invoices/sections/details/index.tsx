import { useGetInvoice } from '@rumsan/raman-ui/queries/invoice.query';
import { InvoiceExtended } from '@rumsan/raman/types';
import ReceiptViewer from './attachment';
import InvoiceDetails from './details';

export default function ReceiptDetails(props: { receiptId: string }) {
  const receiptDetails = useGetInvoice(props.receiptId);
  const receipt: InvoiceExtended =
    receiptDetails?.data as unknown as InvoiceExtended;
  const statusColor =
    receipt?.status === 'REJECTED' ? 'text-red-600' : 'text-green-600';

  return (
    <div className="grid grid-cols-4 gap-6 px-6 h-screen">
      <div className="col-span-2 relative">
        <InvoiceDetails
          className="col-span-2 sticky top-4 self-start"
          receipt={receipt}
        />
        <div className="flex justify-end mt-2 w-full">
          {receipt ? (
            receipt?.status === 'REJECTED' || receipt?.status === 'APPROVED' ? (
              <div className="mt-1 mr-4">
                This receipt has been{' '}
                <b className={statusColor}> {receipt?.status}</b>
                {'.'}
              </div>
            ) : (
              <div className="flex gap-2 py-2 px-2"></div>
            )
          ) : null}
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-4 overflow-y-auto">
        <ReceiptViewer receipt={receipt} />
      </div>
    </div>
  );
}
