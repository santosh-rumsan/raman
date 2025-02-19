import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rumsan/shadcn-ui/components/alert-dialog';
import { AlertType } from '../types/alert.type.js';
import { ToastComp } from './toast.js';

export function AlertComp({ message, title, btnOkay }: AlertType) {
  const ok_altText = btnOkay?.altText || 'Okay';
  const ok_label = btnOkay?.label || 'OK';
  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction aria-details={ok_altText}>
            {ok_label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Alert(props: AlertType) {
  if (props.isToast) {
    return (
      <ToastComp
        message={props.message}
        title={props.title}
        btnOkay={props.btnOkay}
      />
    );
  }
  return (
    <AlertComp
      message={props.message}
      title={props.title}
      btnOkay={props.btnOkay}
    />
  );
}
