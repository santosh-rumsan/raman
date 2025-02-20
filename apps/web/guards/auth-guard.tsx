'use client';

import { PATHS } from '@/routes/paths';
import { useRumsanAppStore } from '@rumsan/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated } = useRumsanAppStore();

  const [checked, setChecked] = useState(false);

  const checkIfAuthenticated = useCallback(() => {
    if (!isAuthenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const href = `${PATHS.AUTH.LOGIN}?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    checkIfAuthenticated();
  }, [checkIfAuthenticated]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
