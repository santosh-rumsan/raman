import { useRequestOtp, useVerifyOtp } from '@rumsan/react-query';
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
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
  otp: string;
};
interface AuthOtpProps {
  email: string | null;
}

export const AuthOtp: React.FC<AuthOtpProps> = ({ email }) => {
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(120);

  const { mutateAsync: verifyOtp, isSuccess, isPending } = useVerifyOtp();
  const { mutateAsync: requestOtp } = useRequestOtp();
  const form = useForm<FormValues>({
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await verifyOtp(otpValue.join(''))
      .then((data: any) => {})
      .catch((error) => {
        const err = error?.response?.data as RSErrorInfo;
        form.setError('otp', {
          message: err.message || 'An unexpected error occurred.',
        });
      });
  };

  const handleResendOtp = async () => {
    if (email && !isResendDisabled) {
      await requestOtp(email)
        .then((data: any) => {
          setOtpValue(Array(6).fill(''));
          form.clearErrors('otp');
        })
        .catch((error) => {
          const err = error?.response?.data as RSErrorInfo;
          form.setError('otp', {
            message: err.message || 'An unexpected error occurred.',
          });
        });
      setIsResendDisabled(true);
    }
  };

  useEffect(() => {
    if (!isResendDisabled) return;
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 120;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const formatRemainingTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d$/.test(value)) {
      // Only allow single digits
      const updatedOtp = [...otpValue];
      updatedOtp[index] = value;
      setOtpValue(updatedOtp);

      // Only shift focus to the next input if current input was empty
      if (index < 5 && otpValue[index] === '') {
        console.log(otpRefs.current[index + 1]);
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      const updatedOtp = [...otpValue];
      if (otpValue[index]) {
        // Clear the current input
        updatedOtp[index] = '';
        setOtpValue(updatedOtp);
      } else if (index > 0) {
        // If current input is empty, move to the previous input
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('Text');
    if (/^\d{6}$/.test(pastedData)) {
      // Check if the pasted data is exactly 6 digits
      const updatedOtp = pastedData.split(''); // Split the OTP into individual digits
      setOtpValue(updatedOtp);

      // Update the value of each input field
      updatedOtp.forEach((digit, index) => {
        if (otpRefs.current[index]) {
          otpRefs.current[index]!.value = digit; // Update the input value
        }
      });

      // Focus the last input
      otpRefs.current[5]?.focus();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="otp"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label
                htmlFor="otp"
                className="flex flex-col text-gray-500 text-base tracking-tight text-center whitespace-pre-line"
              >
                {`OTP code has been sent to ${email}.\nEnter the 6 digit code to continue.`}
              </Label>
              <FormControl>
                <div
                  className="flex space-x-2"
                  onPaste={handlePaste} // Add paste event handler here
                >
                  {/* Render 6 input boxes for the 6 OTP digits */}
                  {[...Array(6)].map((_, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="text-center border-gray-500"
                      value={otpValue[index] || ''}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage>
                {form.formState.errors.otp?.message || ' '}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-fuchsia-700 hover:bg-fuchsia-800"
        >
          Submit
        </Button>
      </form>
      {isResendDisabled ? (
        <p className="text-center text-sm text-gray-500">
          Resend Code in:{' '}
          <span className="text-blue-600">
            {formatRemainingTime(remainingTime)}
          </span>
        </p>
      ) : (
        <button
          type="button"
          onClick={handleResendOtp}
          className="text-blue-600 text-base text-center "
        >
          Resend OTP
        </button>
      )}
    </Form>
  );
};
