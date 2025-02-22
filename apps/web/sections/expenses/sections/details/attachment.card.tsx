import { cn } from '@/utils';
import { Expense, FileAttachment } from '@rumsan/raman';
import { Card, CardContent } from '@rumsan/shadcn-ui/components/card';
import { FileImage, Link2, PlusCircle, X } from 'lucide-react';

type Props = {
  className?: string;
  expense: Expense;
  deleteAttachmentHandler?: (data: {
    id: string;
    attachmentId: string;
  }) => void;
  formData?: FormData;
  addAttachmentHandler?: (files: FileList) => void;
  loadingState?: boolean;
};

export const AttachmentCard = ({
  className,
  expense,
  formData,
  deleteAttachmentHandler,
  addAttachmentHandler,
  loadingState,
}: Props) => {
  const handleImageClick = (attachment: any) => {
    if (attachment) {
      if (attachment.url === 'pending')
        return alert('Attachment is still uploading. Please wait.');
      window.open(attachment.url, '_blank');
    }
  };

  const handleAddAttachment = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;

    input.onchange = () => {
      const files = input.files;

      if (files && addAttachmentHandler) {
        createFormData(files);
        addAttachmentHandler(files);
      }
    };

    input.click();
  };

  const createFormData = (files: FileList): FormData => {
    const form = formData || new FormData();
    Array.from(files).forEach((file) => {
      if (file instanceof Blob || typeof file === 'string') {
        formData?.append('attachments', file);
      } else {
        console.error('Invalid file type:', file);
      }
    });

    return form;
  };

  const handleDeleteAttachment = (hash: string) => {
    if (
      expense?.cuid &&
      window.confirm('Are you sure you want to remove this attachment?')
    ) {
      deleteAttachmentHandler?.({ attachmentId: hash, id: expense.cuid });
    }
  };

  return (
    <Card className={cn('rounded-lg shadow-sm relative', className)}>
      {loadingState && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-1000">
          <p className="text-gray-700 font-semibold">Uploading...</p>
        </div>
      )}

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
            <button
              onClick={handleAddAttachment}
              className="flex items-center text-sm text-blue-500 hover:text-blue-600"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Upload
            </button>
          </div>

          <div className="grid gap-2">
            {typeof expense?.attachments === 'string' ? (
              expense?.attachments === 'pending' ? (
                <p className="text-gray-500">
                  Attachments are uploading, please wait...
                </p>
              ) : (
                <p className="text-gray-500">Invalid attachments data</p>
              )
            ) : Array.isArray(expense?.attachments) ? (
              expense?.attachments.map(
                (attachment: FileAttachment, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-left bg-gray-50 p-2 rounded-md hover:shadow-sm hover:bg-gray-100"
                  >
                    <div
                      onClick={() => handleImageClick(attachment)}
                      className="flex items-center cursor-pointer"
                    >
                      <div
                        className={`h-8 w-8 flex items-center justify-center border rounded-full  ${
                          attachment.url === 'pending'
                            ? 'text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        <FileImage
                          className="h-4 cursor-pointer"
                          strokeWidth={1.75}
                        />
                      </div>
                      <p
                        className={`font-light text-sm ml-2 ${
                          attachment.url === 'pending'
                            ? 'text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {attachment.filename}
                      </p>
                    </div>
                    {attachment.url === 'pending' ? (
                      <div className="loader"></div>
                    ) : (
                      <button
                        onClick={() => handleDeleteAttachment(attachment.hash)}
                        className="flex items-center justify-center h-6 w-6 bg-red-100 text-red-500 rounded-full hover:bg-red-200"
                      >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    )}
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
