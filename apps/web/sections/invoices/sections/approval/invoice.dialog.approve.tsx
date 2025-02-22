import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@rumsan/shadcn-ui/components/dialog';

interface InvoiceApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (data: any) => Promise<void>;
  inv: any;
}

export function InvoiceApproveDialog({
  open,
  onOpenChange,
  onApprove,
  inv,
}: InvoiceApproveDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <div className="grid gap-4">
          <p>Are you sure you want to approve this invoice?</p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            className="min-w-[6rem]"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            No
          </Button>
          <Button
            variant="default"
            className="min-w-[6rem] fw-[600]"
            onClick={() => {
              onApprove(inv);
              onOpenChange(false);
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
