import { cn } from '@/utils';
import { FileAttachment, Invoice } from '@rumsan/raman/types';
import { Card, CardContent } from '@rumsan/shadcn-ui/components/card';
import { FileImage, Link2, X } from 'lucide-react';

type Props = {
  className?: string;
  invoice: Invoice;
  //   loadingState?: boolean;
};

export const ReceiptCard = ({ className, invoice }: Props) => {
  const handleImageClick = (attachment: any) => {
    if (attachment) {
      if (attachment.url === 'pending')
        return alert(
          'Attachment is still uploading. Refresh the page and try after few seconds.',
        );
      window.open(attachment.url, '_blank');
    }
  };

  //   const handleAddAttachment = async () => {
  //     const input = document.createElement('input');
  //     input.type = 'file';
  //     input.multiple = true;
  //     input.onchange = (e: any) => {
  //       const files = e.target.files;

  //       if (files && addAttachmentHandler) {
  //         console.log(files);
  //         addAttachmentHandler(files);
  //       }
  //     };
  //     input.click();
  //   };

  //   const handleDeleteAttachment = (hash: string) => {
  //     if (
  //       expense?.cuid &&
  //       window.confirm('Are you sure you want to remove this attachment?')
  //     ) {
  //       deleteAttachmentHandler?.({ attachmentId: hash, id: expense.cuid });
  //     }
  //   };

  return (
    <Card className={cn('rounded-lg shadow-sm relative', className)}>
      {/* {loadingState && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-1000">
          <p className="text-gray-700 font-semibold">Uploading...</p>
        </div>
      )} */}

      <CardContent className="px-6 py-4">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="rounded-full border flex justify-center items-center bg-gray-100 w-[30px] h-[30px]">
                <Link2 className="h-4" strokeWidth={1.75} />
              </div>
              <h5 className="text-base font-bold ml-3 text-gray-500">
                Attachments
              </h5>
            </div>
          </div>

          <div className="grid gap-2">
            {typeof invoice?.receipts === 'string' ? (
              invoice?.receipts === 'pending' ? (
                <p className="text-gray-500">
                  receipts are uploading, please wait...
                </p>
              ) : (
                <p className="text-gray-500">Invalid receipts data</p>
              )
            ) : Array.isArray(invoice?.receipts) ? (
              invoice?.receipts.map(
                (attachment: FileAttachment, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-left bg-gray-50 p-2 rounded-md hover:shadow-sm hover:bg-gray-100"
                  >
                    <div
                      onClick={() => handleImageClick(attachment)}
                      className="flex items-center cursor-pointer"
                    >
                      <div className="h-8 w-8 flex items-center justify-center border rounded-full bg-gray-100">
                        <FileImage
                          className="h-4 cursor-pointer"
                          strokeWidth={1.75}
                        />
                      </div>
                      <p className="font-light text-sm text-gray-700 ml-2">
                        {attachment.filename}
                      </p>
                    </div>
                    <button
                      //   onClick={() => handleDeleteAttachment(attachment.hash)}
                      className="flex items-center justify-center h-6 w-6 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
                    >
                      <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ),
              )
            ) : (
              <p className="text-gray-500">Invalid attachments data</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
