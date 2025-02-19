import { AlertType } from '../types/alert.type.js';
import { AlertComp } from './alert.js';
import { ToastComp } from './toast.js';

export function AlertError(props: AlertType) {
  if (props.isToast) {
    return (
      <ToastComp message={props.message} title={props.title} isError={true} />
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
