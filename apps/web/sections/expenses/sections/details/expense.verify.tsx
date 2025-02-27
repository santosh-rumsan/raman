import { useApproveExpense } from '@rumsan/raman-ui/queries/expense.query';
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
import { useState } from 'react';

export function CloseVerifyDailog({ expenseId }: { expenseId: string }) {

    const approveExpense = useApproveExpense();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            await approveExpense.mutateAsync({ id: expenseId });
            window.location.reload();
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
                <Button className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">
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

                    <DialogFooter className="mx-auto mt-3">
                        <DialogClose asChild>
                            <Button className="min-w-[230px] " variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            className="min-w-[230px] fw-[600]"
                            onClick={() => handleApprove()}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </div>
        </Dialog>
    );
}
