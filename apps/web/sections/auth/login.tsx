'use client';

import { useRequestOtp } from '@rumsan/react-query';
import { RSErrorInfo } from '@rumsan/sdk';
import { Button } from '@rumsan/shadcn-ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rumsan/shadcn-ui/components/form';
import { Input } from '@rumsan/shadcn-ui/components/input';
import { Label } from '@rumsan/shadcn-ui/components/label';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
  email: string;
};
interface AuthLoginProps {
  setEmail: (email: string) => void;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({ setEmail }) => {
  const { mutateAsync: requestOtp, isSuccess, isPending } = useRequestOtp();
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setEmail(data.email);
    await requestOtp(data.email)
      .then((data: any) => {})
      .catch((error) => {
        const err = error?.response?.data as RSErrorInfo;
        form.setError('email', {
          message: err.message || 'An unexpected error occurred.',
        });
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <p className="flex flex-col text-gray-500 text-sm text-center tracking-tight">
                Enter your email to request OTP code
              </p>
              <Label htmlFor="email" className="flex text-sm font-bold">
                Email
              </Label>
              <FormControl>
                <Input
                  className="text-black"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.email?.message || ' '}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-fuchsia-700 hover:bg-fuchsia-800 text-white"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
