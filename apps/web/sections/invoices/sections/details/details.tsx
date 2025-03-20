import { cn, formatCurrency, IconByName } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { InvoiceExtended } from '@rumsan/raman/types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';

export default function InvoiceDetails({
  className,
  receipt,
}: {
  className?: string;
  receipt: InvoiceExtended;
}) {
  const { lookupByCuid } = useSelectLookUp();
  const category = lookupByCuid('categories', receipt?.categoryId);
  const projectOwner = lookupByCuid('users', receipt?.Project?.owner);

  return (
    <Card className={cn('relative rounded-lg shadow-sm', className)}>
      <CardHeader className="px-6 py-4 relative">
        <div className="absolute top-6 right-6">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold">
              {receipt?.amount && formatCurrency(receipt?.amount)}
            </span>
            <Label className="text-xs text-gray-400">{receipt?.currency}</Label>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full border bg-gray-100 w-8 h-8 flex justify-center items-center">
            <IconByName
              name={category?.meta?.icon}
              defaultIcon="HandCoins"
              className="h-4 w-4"
              strokeWidth={2.5}
            />
          </div>
          <h3 className="text-xl font-bold ml-2 text-gray-700">
            {receipt?.User.name}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-xs font-normal text-gray-400">
              Description
            </Label>
            <p className="text-black font-normal text-sm">
              {receipt?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-normal text-gray-400">
                Category
              </Label>
              <p className="text-black font-normal text-sm">
                {receipt?.Category?.name}
              </p>
            </div>

            <div>
              <Label className="text-xs font-normal text-gray-400">
                Department
              </Label>
              <p className="text-black font-normal text-sm">
                {receipt?.Project?.Department?.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-normal text-gray-400">
                Project
              </Label>
              <p className="text-black font-normal text-sm">
                {receipt?.Project?.name}
              </p>
            </div>
            <div>
              <Label className="text-xs font-normal text-gray-400">
                Project Owner (Approver)
              </Label>
              <p className="text-black font-normal text-sm">
                {projectOwner?.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-normal text-gray-400">
                Invoice Type
              </Label>
              <p className="text-black font-normal text-sm">
                {receipt?.invoiceType}
              </p>
            </div>
            {receipt?.vatAmount && receipt.vatAmount > 0 && (
              <div>
                <Label className="text-xs font-normal text-gray-400">
                  VAT Amount
                </Label>
                <p className="text-black font-normal text-sm">
                  {receipt?.vatAmount}
                </p>
              </div>
            )}
          </div>

          {receipt && receipt.approvalDetails?.remarks && (
            <div>
              <Label className="text-xs font-normal text-gray-400">
                {receipt?.approvalDetails?.isApproved
                  ? 'Approved Remarks'
                  : 'Rejected Reason'}
              </Label>
              <p className="text-black font-normal text-sm">
                {receipt.approvalDetails?.remarks}
              </p>
            </div>
          )}

          {/* <div>
            <Label className="text-xs font-normal text-gray-400">
              Verification
            </Label>
            <p className="text-black font-normal text-sm flex items-center">
              {receipt?.isVerified ? (
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
              {receipt?.verificationDetails?.verifiedBy &&
                lookupByCuid('users', receipt?.verificationDetails?.verifiedBy)
                  ?.name}
            </p>
          </div> */}
        </div>

        {/* <div className="mt-6">
          <Label className="text-xs font-normal text-gray-400">Remarks</Label>
          <p className="text-black font-normal text-sm">{receipt?.remarks}</p>
        </div> */}
      </CardContent>
    </Card>
  );
}
