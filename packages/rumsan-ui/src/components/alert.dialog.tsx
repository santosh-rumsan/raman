import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rumsan/shadcn-ui/components/alert-dialog';
import { AlertTriangle, Check, Info, XCircle } from 'lucide-react';
import React from 'react';

type Variant = 'Success' | 'Error' | 'Warning' | 'Info';

interface CustomAlertDialogProps {
  variant?: Variant; // Make variant optional so that it can have a default value
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const getVariantStyles = (variant: Variant) => {
  switch (variant) {
    case 'Success':
      return {
        icon: <Check className="text-green-500 w-6 h-6" />,
        borderColor: 'border-green-500',
        textColor: 'text-green-600',
        buttonColor: 'border-green-500 text-green-600 hover:bg-green-50',
      };
    case 'Error':
      return {
        icon: <XCircle className="text-red-500 w-6 h-6" />,
        borderColor: 'border-red-500',
        textColor: 'text-red-600',
        buttonColor: 'border-red-500 text-red-600 hover:bg-red-50',
      };
    case 'Warning':
      return {
        icon: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-600',
        buttonColor: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
      };
    case 'Info':
    default:
      return {
        icon: <Info className="text-blue-500 w-6 h-6" />,
        borderColor: 'border-blue-500',
        textColor: 'text-blue-600',
        buttonColor: 'border-blue-500 text-blue-600 hover:bg-blue-50',
      };
  }
};

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  variant = 'Info', // Default to 'Info' variant
  isOpen,
  onClose,
  title,
  description,
}) => {
  const { icon, borderColor, textColor, buttonColor } =
    getVariantStyles(variant);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={`border-0 border-l-4 ${borderColor}`}>
        <AlertDialogHeader className="gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-gray-100 p-3">{icon}</div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-l font-semibold">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm border rounded ${buttonColor}`}
          >
            OK
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;

{
  /* <AlertDialog open={isOpen} onOpenChange={onClose}>
  <AlertDialogContent className="max-w-md">
    <AlertDialogHeader className="gap-4">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-gray-100 p-3">
          <AlertTriangle className="h-6 w-6 text-gray-900" />
        </div>
        <div className="space-y-2">
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </div>
      </div>
    </AlertDialogHeader>
    <AlertDialogFooter className="gap-3 sm:gap-0">
      <button
        onClick={onClose}
        className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 hover:bg-gray-200 sm:w-auto"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-red-600 hover:bg-red-100 sm:w-auto"
      >
        {confirmLabel}
      </button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>; */
}
