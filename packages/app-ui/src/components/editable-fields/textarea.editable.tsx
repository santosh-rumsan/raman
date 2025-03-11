import { Label } from '@rumsan/shadcn-ui/components/label';
import { Textarea } from '@rumsan/shadcn-ui/components/textarea';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BaseEditableFieldProps } from './editable.types';

interface EditableTextAreaProps extends BaseEditableFieldProps {
  inputHeight?: string;
}

export function EditableTextArea({
  label,
  value,
  onSave,
  className = '',
  isEditable = true,
  inputHeight = 'h-40',
}: EditableTextAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Use useEffect to update editValue when value prop changes
  const [editValue, setEditValue] = useState(value?.toString() || '');

  // Update editValue when value prop changes
  useEffect(() => {
    setEditValue(value?.toString() || '');
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  return (
    <div className={`group relative ${className}`}>
      {label && (
        <Label className="text-xs font-normal text-gray-400">{label}</Label>
      )}
      {!isEditing ? (
        <div
          onClick={() => isEditable && setIsEditing(true)}
          className={`text-black font-normal text-sm flex items-center ${
            isEditable
              ? 'group-hover:border-dotted group-hover:border group-hover:border-gray-400 group-hover:rounded cursor-pointer'
              : ''
          } p-1 relative whitespace-pre-wrap`}
        >
          {value}
          {isEditable && (
            <Pencil className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 absolute right-2" />
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`${inputHeight} text-sm border border-gray-200 rounded-md p-1 focus-visible:ring-0`}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) handleSave();
            }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
