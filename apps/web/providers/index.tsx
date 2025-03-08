'use client';

import { TitleProvider } from '@/contexts/title.context';
import { CONFIG } from '@/misc/config';
import { queryClient } from '@rumsan/raman-ui/queries/query.client';
import { ApiClient } from '@rumsan/raman/clients/index';
import { RumsanProvider, useRumsanAppStore } from '@rumsan/react-query';
import { TooltipProvider } from '@rumsan/shadcn-ui/components/tooltip';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { WebSocketProvider } from './websocket.provider';

export const apiClient = new ApiClient({
  baseURL: CONFIG.API_URL,
});

export function Providers({ children }: { children: ReactNode }) {
  const { isInitialized, initialize } = useRumsanAppStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize({
        log: 'App initialized',
      });
    }
    console.log('xxx', process.env.NEXT_PUBLIC_API_URL);
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
