export type AlertType = {
  message: string;
  title?: string;
  variant?: string;
  btnOkay?: {
    label: string;
    altText?: string;
  };
  isToast?: boolean;
  isError?: boolean;
};
