import { FormControl } from '@rumsan/shadcn-ui/components/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn-ui/components/select';
import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface SelectFieldProps {
  name?: string;
  disabled?: boolean;
  selectOptions?: { label: string; value: string }[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

const SelectField = forwardRef<HTMLInputElement, SelectFieldProps>(
  (props, ref) => {
    const { control } = useFormContext();

    let {
      name,
      disabled = false,
      selectOptions = [],
      placeholder = 'Select an item',
      onValueChange,
      onClear,
      showClearButton = true,
    } = props;

    if (!name) {
      throw new Error('SelectField: name is required');
    }

    selectOptions = selectOptions ?? [];
    placeholder = placeholder ?? 'Select an item';
    showClearButton = showClearButton ?? true;

    return (
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <Select
                value={field.value ?? undefined}
                onValueChange={onValueChange ?? field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger
                    className={`${
                      showClearButton && field.value && !disabled ? 'pr-10' : ''
                    }`}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectOptions
                    .filter((item) => item.value.trim() !== '')
                    .map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* Clear button */}
              {showClearButton && field.value && !disabled && (
                <button
                  type="button"
                  onClick={() => {
                    if (onClear) onClear();
                    field.onChange('');
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label="Clear selection"
                >
                  ✕
                </button>
              )}
            </>
          )}
        />
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
export { SelectField };
