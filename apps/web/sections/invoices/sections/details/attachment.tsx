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
      {receipt?.attachments &&
      Array.isArray(receipt?.attachments) &&
      receipt.attachments.length > 0 ? (
        receipt.attachments.map((attachment, index) => (
          <CardContent className="p-2" key={index}>
            {attachment.url === 'pending' ? (
              <div className="w-full h-[100px] border rounded-lg flex items-center justify-center">
                <span>Attachment is uploading...</span>
              </div>
            ) : (
              <iframe
                src={getPreviewLinkForGoogleDocs(attachment.url)}
                className="w-full h-[600px] border rounded-lg"
              />
            )}
          </CardContent>
        ))
      ) : (
        <CardContent className="p-2">No attachments found</CardContent>
      )}
    </Card>
  );
}
