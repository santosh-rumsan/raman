import { AlertType } from '../types/alert.type';
import { AlertComp } from './alert';
import { ToastComp } from './toast';

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
