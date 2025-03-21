'use client';

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
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { useRequestOtp } from '@rumsan/ui/queries/auth.query';
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
  const {toast} = useToast();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setEmail(data.email);
    try {
      await requestOtp(data.email)
        .then((data: any) => {
          toast({
            variant: 'success',
            description: 'OTP sent successfully',
          });
        })
    }
      catch(error) {
        form.setError('email', {
          message: 'Invalid email address',
        });
        toast({
          variant: 'destructive',
          description: 'Failed to send OTP',})
      };
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
              <Label htmlFor="email" className={`flex text-sm font-bold ${form.formState.errors.email ? 'text-red-500' : ''}`}
>
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
