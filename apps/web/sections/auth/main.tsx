'use client';

import { useRumsanAppStore } from '@rumsan/react-query';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rumsan/shadcn-ui/components/card';
import { AuthLogin } from './login';
import { AuthOtp } from './otp';

export function AuthMain() {
  const { challenge } = useRumsanAppStore();
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="h-full flex items-center">
      <div className="w-full flex justify-center items-center px-8">
        <Card className="w-3/4 border rounded-md force-light-mode">
          <CardHeader className="flex items-center space-y-0 pt-2 px-4 py-4">
            <CardTitle className="text-sm font-medium">
              <h1 className="text-2xl font-bold text-gray-700 subpixel-antialiased tracking-wide">
                Raman Administration
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!challenge ? (
              <AuthLogin setEmail={setEmail} />
            ) : (
              <AuthOtp email={email} />
            )}
            <div className="text-xs text-gray-600 text-center mt-6">
              By using this system, you agreed to our terms and conditions.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
