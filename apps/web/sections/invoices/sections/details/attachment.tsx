import { getPreviewLinkForGoogleDocs } from '@/utils/google.utils';
import { InvoiceExtended } from '@rumsan/raman/types';
import { Card, CardContent } from '@rumsan/shadcn-ui/components/card';

export default function ReceiptViewer({
  receipt,
}: {
  receipt: InvoiceExtended;
}) {
  return (
    <Card className="relative rounded-md shadow-sm p-2">
      {/* <CardHeader className="flex flex-row items-center justify-between p-1">
        <h3 className="text-lg font-semibold pl-2">{receipt?.description}</h3>
        {receipt?.isVerified === false && (
          <div className="ml-auto">
            <ExpenseVerificationDialog expenseId={receipt.cuid} />
          </div>
        )}
      </CardHeader> */}
      {(receipt?.attachments &&
        Array.isArray(receipt?.attachments) &&
        receipt.attachments?.map((attachment, index) => {
          const previewUrl = getPreviewLinkForGoogleDocs(attachment.url);
          return (
            <CardContent className="p-2" key={index}>
              <iframe
                src={previewUrl}
                className="w-full h-[600px] border rounded-lg"
                title="PDF Viewer"
              />
            </CardContent>
          );
        })) || <CardContent className="p-2">No attachments found</CardContent>}
    </Card>
  );
}
