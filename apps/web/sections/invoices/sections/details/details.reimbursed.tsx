import { cn } from '@/utils';
import { useExpenseById } from '@rumsan/raman-ui/queries/expense.query';
import { Invoice } from '@rumsan/raman/types/invoice.type';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { format } from 'date-fns';
import { User } from 'lucide-react';

type InvoiceReimbursedProps = {
  className: string;
  invoice: Invoice;
};

export default function InvoiceReimbursedDetails({
  className,
  invoice,
}: InvoiceReimbursedProps) {
  const expenseDetails = useExpenseById(invoice?.expenseId ?? '');
  return (
    <Card className={cn('relative rounded-lg shadow-sm mt-5', className)}>
      <CardHeader className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="mb-2 flex items-center justfiy-center">
            <div className="rounded-full border flex flex-col justify-center bg-gray-100 items-center w-[30px] h-[30px]">
              <User className="h-4" strokeWidth={1.75} />
            </div>
            <h5 className="text-base font-bold ml-3 text-gray-500">
              Reimbursement Details
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="grid grid-cols-4 gap-2">
          <div className="items-center gap-2">
            <Label className="text-xs font-normal text-gray-400">
              Payment From
            </Label>
            <p className="text-black font-normal text-sm">
              {expenseDetails?.data?.Account?.name}
            </p>
          </div>

          <div className="items-center gap-2">
            <Label className="text-xs font-normal text-gray-400">
              Reimbursed Amount
            </Label>
            <p className="text-black font-normal text-sm">{invoice?.amount}</p>
          </div>

          <div className="items-center gap-2">
            <Label className="text-xs font-normal text-gray-400">
              Reimbursed Date
            </Label>
            <p className="text-black font-normal text-sm">
              {format(invoice?.reimbursedDate as Date, 'do MMMM, yyy')}
            </p>
          </div>

          <div className="items-center gap-2">
            <Label className="text-xs font-normal text-gray-400">
              Reimbursed Remarks
            </Label>
            <p className="text-black font-normal text-sm">
              {invoice?.reimbursedRemarks}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
