import { Input } from '@rumsan/shadcn-ui/components/input';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BaseEditableFieldProps } from './editable.types';

interface EditableTextFieldProps extends BaseEditableFieldProps {
  type?: 'text' | 'number';
}

// Add text ellipsis if it exceeds the width
const textEllipsisClass = 'truncate max-w-full';

export function EditableTextField({
  label,
  value,
  onSave,
  type = 'text',
  className = '',
  isEditable = true,
}: EditableTextFieldProps) {
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
          className={`text-black flex items-center pr-6 ${
            isEditable
              ? 'group-hover:border-dotted group-hover:border group-hover:border-gray-400 group-hover:rounded cursor-pointer'
              : ''
          }`}
        >
          <span className="truncate block w-full">{value}</span>
          {isEditable && (
            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 absolute right-2" />
          )}
        </div>
      ) : (
        <div className="flex items-center">
          <Input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`h-7 border border-dotted border-gray-400 rounded focus-visible:ring-0`}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
