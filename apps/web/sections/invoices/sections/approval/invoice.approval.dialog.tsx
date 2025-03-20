import { zodResolver } from '@hookform/resolvers/zod';
import { useInvoiceApproval } from '@rumsan/raman-ui/queries/approval.query';
import { ReceiptApproval } from '@rumsan/raman/types';
import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rumsan/shadcn-ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import { Textarea } from '@rumsan/shadcn-ui/components/textarea';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function ReceiptApprovalDialog({
  invoiceChallange,
  approvalType,
}: {
  invoiceChallange: string;
  approvalType?: 'APPROVAL' | 'REJECTION';
}) {
  const [open, setOpen] = useState(false);

  const schema = z.object({
    remarks: z.string().min(1, 'Remarks should not be empty'),
  });

  const form = useForm<ReceiptApproval>({
    resolver: zodResolver(schema),
    defaultValues: {
      remarks: '',
      status: approvalType === 'REJECTION' ? 'REJECTED' : 'APPROVED',
    },
  });
  const { mutateAsync, isPending } = useInvoiceApproval();

  const onSubmit = async (data: ReceiptApproval) => {
    data.status = approvalType === 'REJECTION' ? 'REJECTED' : 'APPROVED';
    data.remarks = data.remarks?.trim();
    try {
      if (invoiceChallange && data.remarks) {
        await mutateAsync({
          id: invoiceChallange,
          data,
        });
      } else {
        console.error('ApprovalChallenge or remarks is undefined');
      }
    } catch (error) {
      console.error('Failed to add reason:', error);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] [&>button]:hidden">
          <DialogHeader className="gap-1">
            <DialogTitle>
              {approvalType === 'REJECTION'
                ? 'Reject Invoice'
                : 'Approve Invoice'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal">
                        {approvalType === 'REJECTION'
                          ? 'Rejection Reason'
                          : 'Remarks'}
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="remarks..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>

                  {approvalType === 'REJECTION' && (
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 text-white" />
                          <span>Rejecting...</span>
                        </>
                      ) : (
                        'Reject'
                      )}
                    </Button>
                  )}

                  {approvalType === 'APPROVAL' && (
                    <Button
                      type="submit"
                      variant="default"
                      className="bg-green-500"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 text-white" />
                          <span>Approving...</span>
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {approvalType === 'REJECTION' && (
        <Button
          disabled={isPending}
          variant="outline"
          className="w-32 border-red-500 text-red-500"
          onClick={() => setOpen(true)}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 text-white" />
              <span>Processing....</span>
            </>
          ) : (
            'Reject'
          )}
        </Button>
      )}

      {approvalType === 'APPROVAL' && (
        <Button
          disabled={isPending}
          variant="outline"
          className="w-32 bg-green-500 text-white"
          onClick={() => setOpen(true)}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 text-white" />
              <span>Processing....</span>
            </>
          ) : (
            'Approve'
          )}
        </Button>
      )}
    </>
  );
}
