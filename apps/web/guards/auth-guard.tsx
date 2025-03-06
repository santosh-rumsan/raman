'use client';

import { PATHS } from '@/routes/paths';
import { useRumsanAppStore } from '@rumsan/react-query';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useRumsanAppStore();
  const [checked, setChecked] = useState(false);

  const checkIfAuthenticated = useCallback(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        const searchParams = new URLSearchParams({
          returnTo: window.location.pathname,
        }).toString();

        const href = `${PATHS.AUTH.LOGIN}?${searchParams}`;
        router.replace(href);
      } else {
        setChecked(true);
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  useEffect(() => {
    checkIfAuthenticated();
  }, [isAuthenticated, checkIfAuthenticated]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
