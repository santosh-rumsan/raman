'use client';

import { useEditAccount } from '@rumsan/raman-ui/queries/account.query';
import { EditAccount } from '@rumsan/raman/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rumsan/shadcn-ui/components/dialog';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { useState } from 'react';
import { CommonAccountForm } from './accounts.form';

interface AccountEditProps {
  row: any;
  isOpen: boolean;
  onClose: () => void;
}
export function AccountEdit({ row, isOpen, onClose }: AccountEditProps) {
  const { toast } = useToast();
  const editAccount = useEditAccount();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: EditAccount) => {
    try {
      if (row.cuid) {
        await editAccount.mutateAsync({ id: row.cuid, data });
      } else {
        console.error('Account ID is undefined');
      }
      toast({
        description: 'Account updated successfully',
      });
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to edit account:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}
      <DialogContent className="sm:max-w-[442px]">
        <DialogHeader className="gap-1 mb-2">
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription className="font-medium text-sm">
            Update the account details
          </DialogDescription>
        </DialogHeader>
        <CommonAccountForm
          onSubmit={onSubmit}
          defaultValues={{
            name: row.name,
            acctNumber: row.acctNumber || '',
            currency: row.currency,
            Currency: row.currency,
            balance: row.balance,
          }}
          isEdit={true}
          onCancel={() => {
            setDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
