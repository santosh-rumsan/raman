import { cn, formatCurrency, IconByName } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { ExpenseExtended } from '@rumsan/raman/types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { CheckCircle, FileQuestion, XCircle } from 'lucide-react';

export default function ExpenseDetailCard({
  className,
  expense,
}: {
  className?: string;
  expense: ExpenseExtended;
}) {
  const { lookupByCuid } = useSelectLookUp();
  const iconColor =
    expense?.isVerified && expense?.isReconciled
      ? 'text-green-600'
      : expense?.isVerified || expense?.isReconciled
        ? 'text-yellow-600'
        : 'text-red-600';
  const category = lookupByCuid('categories', expense?.categoryId);
  return (
    <Card className={cn('relative rounded-lg shadow-sm', className)}>
      <div className="absolute top-6 right-6 z-10">
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold">
            {expense?.amount && formatCurrency(expense?.amount)}
          </span>
          <Label className="text-xs font-normal text-gray-400">
            {expense?.currency}
          </Label>
        </div>
      </div>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center mb-3">
          <div className="rounded-full border flex justify-center items-center bg-gray-100 w-[30px] h-[30px]">
            {/* <Wallet className="h-4" strokeWidth={1.75} /> */}
            <IconByName
              name={category?.meta?.icon}
              defaultIcon="HandCoins"
              className={cn(iconColor, 'h-4 w-4')}
              strokeWidth={2.5}
            />
          </div>
          <h3 className="text-base ml-2 text-gray-700">
            {expense?.description}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="grid grid-cols-2 gap-6 gap-x-6">
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
              {' '}
              Invoice Type
            </Label>
            <p className="text-black font-normal text-sm">
              {expense?.invoiceType}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Reconcilation Status
            </Label>
            {/* <p className="text-black font-normal text-sm">
              {expense?.isReconciled ? 'Reconciled' : 'Not Reconciled'}
            </p> */}

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

          {expense?.vatAmount && expense.vatAmount > 0 ? (
            <>
              <div>
                <Label className="text-xs font-normal text-gray-400">
                  VAT Amount
                </Label>
                <p className="text-black font-normal text-sm">
                  {expense?.vatAmount}
                </p>
              </div>
            </>
          ) : (
            ''
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
