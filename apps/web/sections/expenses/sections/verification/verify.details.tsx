import { cn, formatCurrency } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { ExpenseExtended } from '@rumsan/raman/types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { CheckCircle, FileQuestion, XCircle } from 'lucide-react';

export default function ExpenseVerificationDetails({
  className,
  expense,
}: {
  className?: string;
  expense: ExpenseExtended;
}) {
  const { lookupByCuid } = useSelectLookUp();
  return (
    <Card className={cn('relative rounded-lg shadow-sm', className)}>
      <CardHeader className="px-6 py-4 flex flex-col items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <span className="text-2xl font-bold">
            {expense?.amount && formatCurrency(expense?.amount)}
          </span>
          <Label className="text-xs font-normal text-gray-400 mt-1">
            {expense?.currency}
          </Label>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-xs font-normal text-gray-400">
              Payment Account
            </Label>
            <p className="text-black font-normal text-sm">
              {expense?.Account?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Category
            </Label>
            <p className="text-black font-normal text-sm">
              {expense?.Category?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Department
            </Label>
            <p className="text-black font-normal text-sm">
              {expense?.Department?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">Project</Label>
            <p className="text-black font-normal text-sm">
              {expense?.Project?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Invoice Type
            </Label>
            <p className="text-black font-normal text-sm">
              {expense?.invoiceType}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Reconciliation Status
            </Label>
            <p className="text-black font-normal text-sm flex items-center">
              {expense?.isReconciled ? (
                <>
                  <CheckCircle
                    strokeWidth={2.5}
                    className="text-green-600 h-4"
                  />
                  Reconciled
                </>
              ) : (
                <>
                  <FileQuestion
                    strokeWidth={2.5}
                    className="text-amber-600 h-4"
                  />
                  Not Reconciled
                </>
              )}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Verification
            </Label>
            <p className="text-black font-normal text-sm flex items-center">
              {expense?.isVerified ? (
                <>
                  <CheckCircle
                    strokeWidth={2.5}
                    className="text-green-600 h-4"
                  />
                  Verified
                </>
              ) : (
                <>
                  <XCircle strokeWidth={2.5} className="text-red-600 h-4" />
                  Unverified
                </>
              )}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Verified By
            </Label>
            <p className="text-black font-normal text-sm">
              {expense?.verificationDetails?.verifiedBy &&
                lookupByCuid('users', expense?.verificationDetails?.verifiedBy)
                  ?.name}
            </p>
          </div>

          {expense?.vatAmount && expense.vatAmount > 0 && (
            <div>
              <Label className="text-xs font-normal text-gray-400">
                VAT Amount
              </Label>
              <p className="text-black font-normal text-sm">
                {expense?.vatAmount}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Label className="text-xs font-normal text-gray-400">Remarks</Label>
          <p className="text-black font-normal text-sm">{expense?.remarks}</p>
        </div>
      </CardContent>
    </Card>
  );
}
