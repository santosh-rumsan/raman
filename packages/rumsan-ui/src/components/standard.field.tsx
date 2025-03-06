import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import React, { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  children: ReactNode;
  disabled?: boolean;
};

export const StandardFormField = ({
  name,
  label,
  placeholder,
  children,
  disabled,
}: Props) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children as React.ReactElement, {
              ...field,
              placeholder,
              disabled,
            })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
