import { Input } from '@rumsan/shadcn-ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rumsan/shadcn-ui/components/select';
import { Controller, useFormContext } from 'react-hook-form';

interface MonetaryValueFieldProps {
  currencyName: string;
  amountName: string;
  disabled?: boolean;
}

export const CurrencyAmountField: React.FC<MonetaryValueFieldProps> = ({
  currencyName,
  amountName,
  disabled,
}) => {
  const { control, setError, clearErrors, getValues } = useFormContext();

  const validateFields = () => {
    const currency = getValues(currencyName);
    const amount = getValues(amountName);

    if (!currency) {
      setError(currencyName, { message: 'Currency is required.' });
      setError(amountName, { message: '' }); // Clear potential amount error
      return;
    }

    if (!amount) {
      setError(amountName, { message: 'Amount is required.' });
      setError(currencyName, { message: '' }); // Clear potential currency error
      return;
    }

    if (Number(amount) <= 0) {
      setError(amountName, { message: 'Amount must be greater than 0.' });
      setError(currencyName, { message: '' }); // Clear potential currency error
      return;
    }

    // Clear errors when all validations pass
    clearErrors([currencyName, amountName]);
  };

  return (
    <div className="flex">
      {/* Currency Select */}
      <Controller
        name={currencyName}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ''}
            onValueChange={(value) => {
              field.onChange(value);
              validateFields();
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-[120px] rounded-r-none">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NPR">NPR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {/* Amount Input */}
      <Controller
        name={amountName}
        control={control}
        render={({ field }) => (
          <Input
            className="flex-1 rounded-l-none border-l-0 text-right"
            type="number"
            disabled={disabled}
            {...field}
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(e.target.value);
              validateFields();
            }}
          />
        )}
      />
    </div>
  );
};
