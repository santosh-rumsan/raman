'use client';
import { useAddAccount } from '@rumsan/raman-ui/queries/account.query';
import { Account } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rumsan/shadcn-ui/components/dialog';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { AlertError } from '@rumsan/ui/components/alert.error';
import { ReactNode, useState } from 'react';
import { CommonAccountForm } from './accounts.form';

export function AccountAdd({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const addAccount = useAddAccount();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: Account) => {
    try {
      await addAccount.mutateAsync(data);
      toast({
        variant: 'success',
        description: 'Account added successfully',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to add account:', error);
      toast({
        variant: 'destructive',
        description: 'Failed to add account',
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertError title="Error" message="" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Create a new account
          </DialogDescription>
        </DialogHeader>
        <CommonAccountForm
          onSubmit={onSubmit}
          defaultValues={{
            name: '',
            acctNumber: '',
            currency: '',
            balance: '',
          }}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
