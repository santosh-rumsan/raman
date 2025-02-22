import { PATHS } from '@/routes/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInvoiceRejection } from '@rumsan/raman-ui/queries/approval.query';
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
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function InvoiceReject({
  show,
  setShow,
  invoiceChallange,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  invoiceChallange?: string;
}) {
  const router = useRouter();
  const schema = z.object({
    reason: z.string().min(1, 'Reason should not be empty'),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: '',
    },
  });
  const { mutateAsync, isPending } = useInvoiceRejection();

  const onSubmit = async (data: any) => {
    try {
      if (invoiceChallange && data.reason) {
        await mutateAsync({
          id: invoiceChallange,
          data,
        });
        router.push(PATHS.INVOICE.DISPOSITION(invoiceChallange));
      } else {
        console.error('ApprovalChallenge or reason is undefined');
      }
    } catch (error) {
      console.error('Failed to add reason:', error);
    }
  };
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Reject Invoice</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  className="min-w-[12rem]"
                  variant="secondary"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="min-w-[12rem] fw-[600]"
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
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
