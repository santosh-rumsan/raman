'use client';

import { TitleProvider } from '@/contexts/title.context';
import { CONFIG } from '@/misc/config';
import { AppEventManager } from '@rumsan/raman-ui/event.manger';
import { queryClient } from '@rumsan/raman-ui/queries/query.client';
import { ApiClient } from '@rumsan/raman/clients/index';
import { TooltipProvider } from '@rumsan/shadcn-ui/components/tooltip';
import { RumsanProvider } from '@rumsan/ui/providers/query.provider';
import { useRumsanAppStore } from '@rumsan/ui/stores/app.store';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { WebSocketProvider } from './websocket.provider';

export const apiClient = new ApiClient(
  {
    baseURL: CONFIG.API_URL,
  },
  AppEventManager,
);

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isInitialized, initialize } = useRumsanAppStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize({
        log: 'App initialized',
      });
    }
  }, [isInitialized, initialize]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <WebSocketProvider url={CONFIG.WS.URL}>
        <QueryClientProvider client={queryClient}>
          <RumsanProvider rumsanClient={apiClient} queryClient={queryClient}>
            <TooltipProvider>
              <TitleProvider>{children}</TitleProvider>
            </TooltipProvider>
          </RumsanProvider>
        </QueryClientProvider>
      </WebSocketProvider>
    </NextThemesProvider>
  );
}
