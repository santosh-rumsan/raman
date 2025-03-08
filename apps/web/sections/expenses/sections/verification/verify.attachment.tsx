import { getPreviewLinkForGoogleDocs } from '@/utils/google.utils';
import { ExpenseExtended } from '@rumsan/raman/types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { ExpenseVerificationDialog } from './verify.dialog';

export default function ExpenseVerificationReceiptViewer({
  expense,
}: {
  expense: ExpenseExtended;
}) {
  return (
    <Card className="relative rounded-md shadow-sm p-2">
      <CardHeader className="flex flex-row items-center justify-between p-1">
        <h3 className="text-lg font-semibold pl-2">{expense?.description}</h3>
        {expense?.isVerified === false && (
          <div className="ml-auto">
            <ExpenseVerificationDialog expenseId={expense.cuid} />
          </div>
        )}
      </CardHeader>
      {expense?.attachments &&
        expense.attachments?.map((attachment, index) => {
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
        })}
    </Card>
  );
}
