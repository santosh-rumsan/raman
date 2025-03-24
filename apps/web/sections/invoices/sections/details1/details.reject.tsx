import { cn } from '@/utils';
import { Invoice } from '@rumsan/raman/types/invoice.type';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { OctagonX } from 'lucide-react';

type InvoiceReimbursedProps = {
  className: string;
  invoice: Invoice;
};

export default function InvoiceRejectedDetails({
  className,
  invoice,
}: InvoiceReimbursedProps) {
  return (
    <Card className={cn('relative rounded-lg shadow-sm w-full', className)}>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justfiy-center">
          <div className="rounded-full border flex flex-col justify-center bg-red-600 items-center w-[30px] h-[30px]">
            <OctagonX className="h-4 text-white" strokeWidth={2.5} />
          </div>
          <h5 className="text-base font-bold ml-3 text-gray-500">
            This invoice has been rejected
          </h5>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="items-center gap-2">
          <Label className="text-xs font-normal text-gray-400">
            Rejection Reason
          </Label>
          <p className="text-black font-normal text-sm">{invoice?.reason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
