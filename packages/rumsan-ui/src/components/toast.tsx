'use client';

import { Button } from '@rumsan/shadcn-ui/components/button';
import { ToastAction } from '@rumsan/shadcn-ui/components/toast';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { AlertType } from '../types/alert.type';

export function ToastComp({ message, title, btnOkay, isError }: AlertType) {
  const ok_altText = btnOkay?.altText || 'Okay';
  const ok_label = btnOkay?.label || 'OK';
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title,
          description: message,
          variant: isError ? 'destructive' : 'default',
          action: <ToastAction altText={ok_altText}>{ok_label}</ToastAction>,
        });
      }}
    >
      Add to calendar
    </Button>
  );
}
