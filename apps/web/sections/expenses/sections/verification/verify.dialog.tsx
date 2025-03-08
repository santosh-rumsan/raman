import { AppStyles } from '@/misc/app.style';
import { useVerifyExpense } from '@rumsan/raman-ui/queries/expense.query';
import { InvoiceType } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rumsan/shadcn-ui/components/dialog';
import { Label } from '@rumsan/shadcn-ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn-ui/components/select';
import { cn } from '@rumsan/shadcn-ui/lib/utils';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function ExpenseVerificationDialog({
  expenseId,
}: {
  expenseId: string;
}) {
  const verify = useVerifyExpense();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [receiptType, setReceiptType] = useState<InvoiceType | undefined>(); // Store selected receipt type

  const handleApprove = async () => {
    if (!receiptType) return; // Prevent submission if receipt type is not selected
    setIsLoading(true);
    try {
      await verify.mutateAsync({ id: expenseId, receiptType });
      setDialogOpen(false);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(AppStyles.button, 'bg-green-500')}
          variant={'default'}
        >
          <ShieldCheck />
          Verify
        </Button>
      </DialogTrigger>
      <div>
        <DialogContent className="sm:max-w-[560px] p-7 [&>button]:hidden">
          <button className="hidden">X</button>

          <DialogHeader className="gap-1 justify-center items-center mb-2">
            <DialogTitle>
              Are you sure you want to verify this expense?
            </DialogTitle>
            <DialogDescription className="font-medium text-md">
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>

          {/* Dropdown for Receipt Type using shadcn Select */}
          <div className="mb-4">
            <Label>Receipt Type</Label>
            <Select
              value={receiptType}
              onValueChange={(val) => setReceiptType(val as InvoiceType)}
            >
              <SelectTrigger className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between">
                <SelectValue placeholder="Select a receipt type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESTIMATE">Estimate Receipt</SelectItem>
                <SelectItem value="PAN">PAN Receipt</SelectItem>
                <SelectItem value="VAT">VAT Receipt</SelectItem>
                <SelectItem value="BANK_TRANSFER">
                  Bank Transfer/Fonepay Proof (less than Rs. 500)
                </SelectItem>
                <SelectItem value="VOUCHER">
                  Office Voucher (less than Rs. 300)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mx-auto mt-3">
            <DialogClose asChild>
              <Button className="min-w-[230px] " variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="min-w-[230px] fw-[600]"
              onClick={() => handleApprove()}
              disabled={isLoading || !receiptType}
            >
              {isLoading ? 'Verifying...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
}
