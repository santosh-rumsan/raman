'use client';

import { PATHS } from '@/routes/paths';
import { AppEventManager } from '@rumsan/raman-ui/event.manger';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { useRumsanAppStore } from '@rumsan/ui/stores/app.store';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isInitialized, logout } = useRumsanAppStore();
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

  useEffect(() => {
    AppEventManager.on('APIERROR', (data) => {
      if (data?.status === 401) {
        logout();
      }

      if (data?.data?.message) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data?.data?.message,
        });
      }
    });
    return () => {
      AppEventManager.removeAllListeners('APIERROR');
    };
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
