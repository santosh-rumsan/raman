export interface BaseEditableFieldProps {
  label?: string;
  value: string | number;
  isEditable?: boolean;
  onSave: (value: string) => void;
  className?: string;
}
