import { cn, formatCurrency } from '@/utils';
import { Expense } from '@rumsan/raman';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { BadgeCheck, BadgeHelp, Wallet } from 'lucide-react';
import { statusColor } from '../list/list.columns';

export default function ExpenseDetailCard({
  className,
  expense,
}: {
  className?: string;
  expense: Expense;
}) {
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
            <Wallet className="h-4" strokeWidth={1.75} />
          </div>
          <h3 className="text-base ml-3 text-gray-700">
            {expense?.description}
          </h3>
          {expense?.isApproved ? (
            <BadgeCheck strokeWidth={2.5} className="h-4" color="#4CAF50" />
          ) : (
            <BadgeHelp strokeWidth={2.5} className="h-4" color="#FFC107" />
          )}
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
            <Label className="text-xs font-normal text-gray-400">Status</Label>
            <p
              className={`flex space-x-2 h-6 w-[80px] font-normal text-sm items-center justify-center rounded-2xl p-2 ${statusColor
              [String(expense?.isPending) as keyof typeof statusColor
              ]
                }`}
            >
              {expense?.isPending ? 'Pending' : 'Reconciled'}
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
