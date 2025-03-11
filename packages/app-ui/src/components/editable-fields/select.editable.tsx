import { ComboboxPopover } from '@rumsan/shadcn-ui/components/combo-popover';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BaseEditableFieldProps } from './editable.types';

interface EditableSelectFieldProps extends BaseEditableFieldProps {
  options: Array<{
    label: string;
    value: string;
  }>;
}

export function EditableSelectField({
  label,
  value,
  options,
  onSave,
  className = '',
  isEditable = true,
}: EditableSelectFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const currentOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSave = (newValue: string) => {
    onSave(newValue);
    setIsEditing(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

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
          } p-1 relative`}
        >
          {currentOption?.label || value}
          {isEditable && (
            <Pencil className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 absolute right-2" />
          )}
        </div>
      ) : (
        <ComboboxPopover
          label={label || ''}
          options={options}
          className="border border-gray-400 border-dotted"
          selectedValue={value.toString()}
          onSelect={handleSave}
        />
      )}
    </div>
  );
}
